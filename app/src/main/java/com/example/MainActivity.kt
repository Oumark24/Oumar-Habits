package com.example

import android.annotation.SuppressLint
import android.app.Activity
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.app.NotificationCompat
import com.example.ui.theme.MyApplicationTheme
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                val webViewRef = remember { mutableStateOf<WebView?>(null) }
                val coroutineScope = rememberCoroutineScope()

                // Handle system back button to navigate back in webview history
                BackHandler(enabled = webViewRef.value?.canGoBack() == true) {
                    webViewRef.value?.goBack()
                }

                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    AndroidView(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding),
                        factory = { context ->
                            WebView(context).apply {
                                layoutParams = android.view.ViewGroup.LayoutParams(
                                    android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                                    android.view.ViewGroup.LayoutParams.MATCH_PARENT
                                )
                                
                                // Configure WebView settings for full dynamic PWA support
                                @SuppressLint("SetJavaScriptEnabled")
                                settings.javaScriptEnabled = true
                                settings.domStorageEnabled = true
                                settings.databaseEnabled = true
                                settings.allowFileAccess = true
                                settings.allowContentAccess = true
                                settings.useWideViewPort = true
                                settings.loadWithOverviewMode = true
                                settings.mediaPlaybackRequiresUserGesture = false

                                webViewClient = object : WebViewClient() {
                                    override fun shouldOverrideUrlLoading(
                                        view: WebView?,
                                        url: String?
                                    ): Boolean {
                                        return false // Let WebView load local pages directly
                                    }
                                }
                                
                                webChromeClient = WebChromeClient()

                                // Bind Native-Web Communication Bridge
                                addJavascriptInterface(
                                    AndroidBridge(
                                        activity = context as Activity,
                                        webView = this,
                                        coroutineScope = coroutineScope
                                    ),
                                    "AndroidBridge"
                                )

                                // Load local PWA index file
                                loadUrl("file:///android_asset/www/index.html")
                                webViewRef.value = this
                            }
                        },
                        update = { webView ->
                            webViewRef.value = webView
                        }
                    )
                }
            }
        }
    }
}

// --- Native Javascript Interface Bridge ---
class AndroidBridge(
    private val activity: Activity,
    private val webView: WebView,
    private val coroutineScope: CoroutineScope
) {
    private val client = OkHttpClient.Builder()
        .connectTimeout(60, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .build()

    @JavascriptInterface
    fun showLocalNotification(title: String, message: String) {
        activity.runOnUiThread {
            Toast.makeText(activity, "$title: $message", Toast.LENGTH_SHORT).show()
        }
        triggerSystemNotification(activity, title, message)
    }

    @JavascriptInterface
    fun callGeminiAPI(prompt: String, callbackName: String) {
        coroutineScope.launch(Dispatchers.IO) {
            val result = makeGeminiApiCall(prompt)
            activity.runOnUiThread {
                val escapedResult = escapeJavascriptString(result)
                webView.evaluateJavascript("javascript:$callbackName('$escapedResult')", null)
            }
        }
    }

    @JavascriptInterface
    fun callWeeklyReviewAPI(prompt: String, callbackName: String) {
        coroutineScope.launch(Dispatchers.IO) {
            val result = makeGeminiApiCall(prompt)
            activity.runOnUiThread {
                val escapedResult = escapeJavascriptString(result)
                webView.evaluateJavascript("javascript:$callbackName('$escapedResult')", null)
            }
        }
    }

    private fun makeGeminiApiCall(prompt: String): String {
        val apiKey = BuildConfig.GEMINI_API_KEY
        if (apiKey.isEmpty() || apiKey == "MY_GEMINI_API_KEY") {
            return "Oumar, your local rule-based intelligence is active. To enable advanced server-side analysis, go to the Secrets panel in AI Studio and configure your GEMINI_API_KEY."
        }

        // Direct REST API for Gemini 3.5 Flash Content Generation
        val url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=$apiKey"

        val jsonBody = JSONObject().apply {
            put("contents", JSONArray().apply {
                put(JSONObject().apply {
                    put("parts", JSONArray().apply {
                        put(JSONObject().apply {
                            put("text", prompt)
                        })
                    })
                })
            })
        }

        val body = jsonBody.toString().toRequestBody("application/json; charset=utf-8".toMediaType())
        val request = Request.Builder()
            .url(url)
            .post(body)
            .build()

        return try {
            client.newCall(request).execute().use { response ->
                if (!response.isSuccessful) {
                    return "Error calling Gemini API: HTTP ${response.code} ${response.message}"
                }
                val rawBody = response.body?.string() ?: return "Error: Received empty body from API."
                val jsonResponse = JSONObject(rawBody)
                val candidates = jsonResponse.getJSONArray("candidates")
                if (candidates.length() > 0) {
                    val candidate = candidates.getJSONObject(0)
                    val parts = candidate.getJSONObject("content").getJSONArray("parts")
                    if (parts.length() > 0) {
                        return parts.getJSONObject(0).getString("text")
                    }
                }
                "Error: No response candidates returned."
            }
        } catch (e: Exception) {
            "Connection Exception: ${e.message}. Check your internet connection."
        }
    }

    private fun escapeJavascriptString(s: String): String {
        return s.replace("\\", "\\\\")
            .replace("'", "\\'")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
    }

    private fun triggerSystemNotification(context: Context, title: String, message: String) {
        val channelId = "oumar_habits_alerts"
        val notificationId = System.currentTimeMillis().toInt()

        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Oumar Habits Alerts",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Channel for habit tracking alerts and focus completion chimes"
            }
            notificationManager.createNotificationChannel(channel)
        }

        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        val builder = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)

        notificationManager.notify(notificationId, builder.build())
    }
}
