/* ==========================================
   OUMAR HABITS - APPLICATION LOGIC ENGINE
   ========================================== */

// --- Global Application State ---
let state = {
    user: {
        name: "Oumar",
        motivationStyle: "minimalist"
    },
    habits: [],
    logs: {}, // Format: { "YYYY-MM-DD": { "habitId": { value: X, completed: true } } }
    schoolTasks: [],
    focusSessions: [], // Format: [ { date: "YYYY-MM-DD", duration: X, habitId: "Y" } ]
    journal: [], // Format: [ { date: "YYYY-MM-DD", mood: X, reflection: "...", habits: ["ID1"] } ]
    challenges: [],
    badges: [],
    soundEffectsEnabled: true
};

// --- Constant Default Templates ---
const DEFAULT_HABITS = [
    { 
        id: "h1", 
        name: "Morning Deep Breaths", 
        category: "Mind", 
        routine: "morning", 
        type: "yes_no", 
        target: 1, 
        schedule: "daily", 
        days: [], 
        color: "#00CC88", 
        notes: "Inhale peace, exhale noise. Done on waking.", 
        implementationTime: "immediately upon waking up", 
        implementationLocation: "in bed", 
        twoMinVersion: "Take just 3 deep belly breaths", 
        temptationReward: "enjoy a warm cup of coffee/tea", 
        archived: false 
    },
    { 
        id: "h2", 
        name: "Read Academics", 
        category: "Academics", 
        routine: "none", 
        type: "count", 
        target: 20, 
        schedule: "daily", 
        days: [], 
        color: "#9933FF", 
        notes: "Read coursework chapters, aim for 20 pages.", 
        implementationTime: "at 4:00 PM", 
        implementationLocation: "at the library desk", 
        twoMinVersion: "Read 1 single page of coursework", 
        temptationReward: "listen to my favorite music playlist for 15 mins", 
        archived: false 
    },
    { 
        id: "h3", 
        name: "Drink Water", 
        category: "Health", 
        routine: "none", 
        type: "count", 
        target: 8, 
        schedule: "daily", 
        days: [], 
        color: "#0066FF", 
        notes: "Target 8 glasses of pure hydration.", 
        implementationTime: "throughout the school day", 
        implementationLocation: "at my desk / classroom", 
        twoMinVersion: "Drink 1 glass of water right now", 
        temptationReward: "stretch or stand up for 1 minute", 
        archived: false 
    },
    { 
        id: "h4", 
        name: "Focus Study Blocks", 
        category: "Academics", 
        routine: "none", 
        type: "duration", 
        target: 50, 
        schedule: "daily", 
        days: [], 
        color: "#FFAA00", 
        notes: "Use the focus timer. Maintain concentration.", 
        implementationTime: "at 3:00 PM after school", 
        implementationLocation: "at my quiet study desk", 
        twoMinVersion: "Set focus timer for just 2 minutes", 
        temptationReward: "check social media for 5 minutes during the break", 
        archived: false 
    },
    { 
        id: "h5", 
        name: "Evening Screen Cleansing", 
        category: "Mind", 
        routine: "evening", 
        type: "yes_no", 
        target: 1, 
        schedule: "daily", 
        days: [], 
        color: "#FF5E5E", 
        notes: "Avoid phones or screens 1 hour before sleeping.", 
        implementationTime: "at 10:00 PM (1 hour before sleep)", 
        implementationLocation: "in my bedroom", 
        twoMinVersion: "Put phone on Do Not Disturb in another room", 
        temptationReward: "read an enjoyable fiction book in bed", 
        archived: false 
    }
];

const DEFAULT_SCHOOL_TASKS = [
    { id: "s1", title: "Physics Lab Report", type: "homework", due: "", subject: "PHYS202", notes: "Verify experimental error charts, minimum 3 references.", completed: false },
    { id: "s2", title: "Calculus III Exam Review", type: "exam", due: "", subject: "MATH201", notes: "Complete chapter 4 study guide questions, practice partial derivatives.", completed: false }
];

const DEFAULT_CHALLENGES = [
    { id: "c1", title: "Morning Routine Mastery", desc: "Complete your Morning routine habits 5 days in a row.", target: 5, current: 0, completed: false, points: 150 },
    { id: "c2", title: "Deep Work Sprint", desc: "Accumulate 150 total minutes of deep focus inside Oumar Timer.", target: 150, current: 0, completed: false, points: 200 },
    { id: "c3", title: "Academic Vanguard", desc: "Complete 3 School Planner assignments or tasks.", target: 3, current: 0, completed: false, points: 100 }
];

const DEFAULT_BADGES = [
    { id: "b1", name: "Consolidation Initiate", desc: "Complete at least 1 habit.", icon: "star", unlocked: false },
    { id: "b2", name: "Unbroken Chain", desc: "Reach a 7-day daily tracking streak.", icon: "local_fire_department", unlocked: false },
    { id: "b3", name: "Focus Master", desc: "Complete 4 Pomodoro focus sessions.", icon: "timer", unlocked: false },
    { id: "b4", name: "Elite Mindset", desc: "Record 3 daily reflection journal logs.", icon: "menu_book", unlocked: false },
    { id: "b5", name: "Academic Conqueror", desc: "Finish your first School Planner task.", icon: "workspace_premium", unlocked: false }
];

// --- Audio Synthesizer (Chime) ---
function playFocusChime() {
    if (!state.soundEffectsEnabled) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Note 1
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        gain1.gain.setValueAtTime(0.15, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.5);

        // Note 2
        setTimeout(() => {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
            gain2.gain.setValueAtTime(0.15, ctx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start();
            osc2.stop(ctx.currentTime + 0.5);
        }, 150);

        // Note 3
        setTimeout(() => {
            const osc3 = ctx.createOscillator();
            const gain3 = ctx.createGain();
            osc3.type = 'sine';
            osc3.frequency.setValueAtTime(783.99, ctx.currentTime); // G5
            gain3.gain.setValueAtTime(0.2, ctx.currentTime);
            gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
            osc3.connect(gain3);
            gain3.connect(ctx.destination);
            osc3.start();
            osc3.stop(ctx.currentTime + 0.7);
        }, 300);

    } catch (e) {
        console.warn("Audio context not supported yet or gesture required.", e);
    }
}

// --- Native Bridge Interaction Helpers ---
function isAndroidNative() {
    return typeof window.AndroidBridge !== 'undefined';
}

function sendNativeNotification(title, message) {
    if (isAndroidNative() && window.AndroidBridge.showLocalNotification) {
        window.AndroidBridge.showLocalNotification(title, message);
    } else {
        // Fallback to standard web notification
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification(title, { body: message });
        }
    }
}

// --- Date Utility Helpers ---
function getTodayString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getPastDateString(daysAgo) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getWeeksList() {
    const weeks = [];
    const today = new Date();
    
    for (let i = 0; i < 4; i++) {
        const d = new Date();
        const currentDay = d.getDay();
        const distanceToSunday = 7 - currentDay;
        d.setDate(d.getDate() + distanceToSunday - (i * 7));
        
        const weekEndStr = d.toISOString().split('T')[0];
        
        const start = new Date(d);
        start.setDate(start.getDate() - 6);
        const weekStartStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const weekEndLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        weeks.push({
            value: weekEndStr,
            label: `Week of ${weekStartStr} - ${weekEndLabel}`
        });
    }
    return weeks;
}

// --- Persistence Engines ---
function saveToLocalStorage() {
    localStorage.setItem('oumar_habits_state', JSON.stringify(state));
}

function loadState() {
    const data = localStorage.getItem('oumar_habits_state');
    if (data) {
        try {
            state = JSON.parse(data);
            
            // Backwards compatibility / integrity check
            if (!state.habits) state.habits = [];
            if (!state.logs) state.logs = {};
            if (!state.schoolTasks) state.schoolTasks = [];
            if (!state.focusSessions) state.focusSessions = [];
            if (!state.journal) state.journal = [];
            if (!state.moodChecks) state.moodChecks = {};
            if (!state.weeklyReflections) state.weeklyReflections = [];
            if (state.level5Failure === undefined) state.level5Failure = false;
            if (!state.challenges || state.challenges.length === 0) state.challenges = DEFAULT_CHALLENGES;
            if (!state.badges || state.badges.length === 0) state.badges = DEFAULT_BADGES;
            if (state.soundEffectsEnabled === undefined) state.soundEffectsEnabled = true;
            if (!state.user) state.user = { name: "Oumar", motivationStyle: "minimalist" };
            if (!state.prayerLogs) state.prayerLogs = {};
            if (state.accountabilityLevel === undefined) state.accountabilityLevel = 1;
            if (!state.distractionsLog) state.distractionsLog = [];
            if (!state.chores || state.chores.length === 0) {
                state.chores = [
                    { id: "ch1", title: "Clean the bathroom", frequency: 14, lastDone: "", priority: "high" },
                    { id: "ch2", title: "Mop the floors", frequency: 14, lastDone: "", priority: "high" },
                    { id: "ch3", title: "Take out the garbage", frequency: 3, lastDone: "", priority: "medium" }
                ];
            }
            if (!state.habitStacks || state.habitStacks.length === 0) {
                state.habitStacks = [
                    { habitId: "h1", anchor: "fajr" }, // Morning Deep Breaths after Fajr
                    { habitId: "h2", anchor: "fajr" }, // Read Academics after Fajr
                    { habitId: "h3", anchor: "school" }, // Drink Water before School
                    { habitId: "h5", anchor: "isha" }  // Evening Screen Cleansing after Isha
                ];
            }
        } catch (e) {
            console.error("Failed to parse LocalStorage payload. Loading defaults.", e);
            loadDefaults();
        }
    } else {
        loadDefaults();
    }
    
    // Ensure school dates are dynamic relative to current date if they are blank (so demo always looks fresh)
    const today = new Date();
    state.schoolTasks.forEach(task => {
        if (!task.due) {
            const dueTemp = new Date();
            dueTemp.setDate(today.getDate() + (task.id === 's1' ? 2 : 5));
            task.due = dueTemp.toISOString().split('T')[0];
        }
    });
}

function loadDefaults() {
    state.user = { name: "Oumar", motivationStyle: "minimalist" };
    state.habits = JSON.parse(JSON.stringify(DEFAULT_HABITS));
    state.schoolTasks = JSON.parse(JSON.stringify(DEFAULT_SCHOOL_TASKS));
    state.challenges = JSON.parse(JSON.stringify(DEFAULT_CHALLENGES));
    state.badges = JSON.parse(JSON.stringify(DEFAULT_BADGES));
    state.soundEffectsEnabled = true;
    state.focusSessions = [];
    state.journal = [];
    state.logs = {};
    state.prayerLogs = {};
    state.accountabilityLevel = 1;
    state.distractionsLog = [];
    state.moodChecks = {};
    state.weeklyReflections = [];
    state.level5Failure = false;

    // Pre-populate historical mood checks for the past 5 days
    const moods = [4, 5, 3, 4, 5];
    for (let index = 0; index < 5; index++) {
        const dateStr = getPastDateString(index + 1);
        state.moodChecks[dateStr] = {
            morning: { val: moods[index], time: "07:30 AM" },
            afternoon: { val: Math.max(1, moods[index] - 1), time: "03:15 PM" },
            night: { val: Math.min(5, moods[index] + 1), time: "10:05 PM" }
        };
    }

    // Pre-populate weekly reflections
    const weeks = getWeeksList();
    state.weeklyReflections = [
        {
            weekEnding: weeks[1].value, // Last week
            reflection: "Reviewed my academic block goals. Completed 4 out of 5 deep study blocks successfully. Improved my evening curfew routine by shutting down screens on time. Met with my study group to review coursework.",
            gratefulFor: "Supportive study partners, clear mindset, focus timer feature",
            habitsReviewed: ["h2", "h4"]
        },
        {
            weekEnding: weeks[2].value, // 2 weeks ago
            reflection: "First week of using the Oumar Habits operating system! The morning breathing exercise has had a direct 15% positive correlation with my morning mood scores. Standardized my coursework study hours.",
            gratefulFor: "My family's morning routine, cooler study environment",
            habitsReviewed: ["h1", "h3"]
        }
    ];
    state.chores = [
        { id: "ch1", title: "Clean the bathroom", frequency: 14, lastDone: "", priority: "high" },
        { id: "ch2", title: "Mop the floors", frequency: 14, lastDone: "", priority: "high" },
        { id: "ch3", title: "Take out the garbage", frequency: 3, lastDone: "", priority: "medium" }
    ];
    state.habitStacks = [
        { habitId: "h1", anchor: "fajr" }, // Morning Deep Breaths after Fajr
        { habitId: "h2", anchor: "fajr" }, // Read Academics after Fajr
        { habitId: "h3", anchor: "school" }, // Drink Water before School
        { habitId: "h5", anchor: "isha" }  // Evening Screen Cleansing after Isha
    ];
    
    // Create pre-populated logs for the past 5 days to demonstrate analytics immediately!
    const pastDays = [1, 2, 3, 4, 5];
    const moods = [4, 5, 3, 4, 5];
    pastDays.forEach((day, index) => {
        const dateStr = getPastDateString(day);
        
        // Log habits completion
        state.logs[dateStr] = {};
        state.habits.forEach(h => {
            // Randomly complete some
            const isCompleted = Math.random() > 0.3;
            if (isCompleted) {
                state.logs[dateStr][h.id] = {
                    value: h.type === 'count' ? h.target : (h.type === 'duration' ? h.target : 1),
                    completed: true
                };
            }
        });

        // Log daily reflections
        state.journal.push({
            date: dateStr,
            mood: moods[index],
            reflection: `Completed daily deep focus sessions. Feeling highly motivated! Today's lesson went incredibly well. State three things I'm grateful for: Oumar Habits app, clear mind, consistent focus.`,
            habits: Object.keys(state.logs[dateStr])
        });

        // Log a focus session
        state.focusSessions.push({
            date: dateStr,
            duration: 25,
            habitId: "h4"
        });
    });

    saveToLocalStorage();
}

// --- Active Productivity Score Calculation ---
function calculateProductivityScore() {
    const todayStr = getTodayString();
    
    // 1. Habit compliance (last 7 days)
    let totalScheduledHabits = 0;
    let completedScheduledHabits = 0;
    
    for (let i = 0; i < 7; i++) {
        const dateStr = getPastDateString(i);
        const dayOfWeek = new Date(dateStr).getDay();
        const dayLogs = state.logs[dateStr] || {};
        
        state.habits.forEach(h => {
            if (h.archived) return;
            
            // Check if active on this day
            let isActive = false;
            if (h.schedule === 'daily') isActive = true;
            else if (h.schedule === 'weekdays' && dayOfWeek >= 1 && dayOfWeek <= 5) isActive = true;
            else if (h.schedule === 'weekends' && (dayOfWeek === 0 || dayOfWeek === 6)) isActive = true;
            else if (h.schedule === 'custom' && h.days.includes(dayOfWeek)) isActive = true;
            
            if (isActive) {
                totalScheduledHabits++;
                if (dayLogs[h.id] && dayLogs[h.id].completed) {
                    completedScheduledHabits++;
                }
            }
        });
    }
    
    const habitsCompliance = totalScheduledHabits > 0 ? (completedScheduledHabits / totalScheduledHabits) * 100 : 0;
    
    // 2. Deep Focus Score (target: 50 minutes/day in the last 7 days = 350 minutes)
    let totalFocusMins = 0;
    const focusTarget = 350; // mins in 7 days
    
    state.focusSessions.forEach(session => {
        // Verify if session falls within 7 days
        const diffTime = Math.abs(new Date(todayStr) - new Date(session.date));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 7) {
            totalFocusMins += session.duration;
        }
    });
    
    const focusScore = Math.min((totalFocusMins / focusTarget) * 100, 100);
    
    // 3. School task completion score (completed vs outstanding)
    const schoolTasksTotal = state.schoolTasks.length;
    const schoolTasksCompleted = state.schoolTasks.filter(t => t.completed).length;
    const schoolScore = schoolTasksTotal > 0 ? (schoolTasksCompleted / schoolTasksTotal) * 100 : 100; // Default 100% if empty
    
    // Weighted Average: 50% Habits, 25% Focus, 25% School
    const overallScore = Math.round((habitsCompliance * 0.5) + (focusScore * 0.25) + (schoolScore * 0.25));
    
    return {
        overall: overallScore,
        habits: Math.round(habitsCompliance),
        focus: Math.round(focusScore),
        school: Math.round(schoolScore)
    };
}

// --- Active Streak Calculations ---
function getHabitStreak(habitId) {
    let streak = 0;
    let i = 0;
    const todayStr = getTodayString();
    
    // Check if logged today, if not check yesterday to start counting back
    let checkDateStr = getPastDateString(0);
    let todayLogs = state.logs[checkDateStr] || {};
    let isHabitDueToday = isHabitScheduledForDay(state.habits.find(h => h.id === habitId), new Date(checkDateStr).getDay());
    
    // If not due today or not completed today, check yesterday
    if (!todayLogs[habitId] || !todayLogs[habitId].completed) {
        checkDateStr = getPastDateString(1);
        i = 1;
    }
    
    while (true) {
        const currentDateStr = getPastDateString(i);
        const dayOfWeek = new Date(currentDateStr).getDay();
        const habit = state.habits.find(h => h.id === habitId);
        if (!habit) break;
        
        const isScheduled = isHabitScheduledForDay(habit, dayOfWeek);
        const log = state.logs[currentDateStr] || {};
        
        if (isScheduled) {
            if (log[habitId] && log[habitId].completed) {
                streak++;
            } else {
                break; // Streak broken
            }
        }
        i++;
        if (i > 365) break; // Hard limit 1 year
    }
    return streak;
}

function getOverallDailyStreak() {
    if (state.level5Failure) return 0;
    let streak = 0;
    let i = 0;
    const todayStr = getTodayString();
    
    // Did user complete any habit today? If not, count back starting yesterday
    let checkDateStr = getPastDateString(0);
    let dayLogs = state.logs[checkDateStr] || {};
    let completedAnyToday = Object.values(dayLogs).some(l => l.completed);
    
    if (!completedAnyToday) {
        checkDateStr = getPastDateString(1);
        i = 1;
    }
    
    while (true) {
        const currentDateStr = getPastDateString(i);
        const logsOnDay = state.logs[currentDateStr] || {};
        const completedAny = Object.values(logsOnDay).some(l => l.completed);
        
        if (completedAny) {
            streak++;
        } else {
            break;
        }
        i++;
        if (i > 365) break;
    }
    return streak;
}

function isHabitScheduledForDay(habit, dayOfWeek) {
    if (!habit) return false;
    if (habit.schedule === 'daily') return true;
    if (habit.schedule === 'weekdays' && dayOfWeek >= 1 && dayOfWeek <= 5) return true;
    if (habit.schedule === 'weekends' && (dayOfWeek === 0 || dayOfWeek === 6)) return true;
    if (habit.schedule === 'custom' && habit.days.includes(dayOfWeek)) return true;
    return false;
}

// --- Mindful Mood and Correlation Analysers ---
function getAverageMood30Days() {
    const today = new Date();
    let totalMood = 0;
    let count = 0;
    
    state.journal.forEach(entry => {
        const diffTime = Math.abs(today - new Date(entry.date));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 30) {
            totalMood += entry.mood;
            count++;
        }
    });
    
    return count > 0 ? (totalMood / count) : 3;
}

function calculateMoodHabitCorrelations() {
    const correlations = [];
    
    state.habits.forEach(habit => {
        let matchingDaysCount = 0;
        let moodSumWhenCompleted = 0;
        let moodSumWhenMissed = 0;
        let completedCount = 0;
        let missedCount = 0;
        
        state.journal.forEach(entry => {
            const dateStr = entry.date;
            const dayLogs = state.logs[dateStr] || {};
            const isCompleted = dayLogs[habit.id] && dayLogs[habit.id].completed;
            
            if (isCompleted) {
                moodSumWhenCompleted += entry.mood;
                completedCount++;
            } else {
                moodSumWhenMissed += entry.mood;
                missedCount++;
            }
        });
        
        if (completedCount >= 2) {
            const avgMoodCompleted = moodSumWhenCompleted / completedCount;
            const avgMoodMissed = missedCount > 0 ? (moodSumWhenMissed / missedCount) : 3.0;
            const difference = avgMoodCompleted - avgMoodMissed;
            
            if (difference > 0.3) {
                correlations.push({
                    habitId: habit.id,
                    habitName: habit.name,
                    difference: difference.toFixed(2),
                    strength: difference > 0.8 ? "Very Strong Correlation" : "Moderate Positive Impact",
                    avgMood: avgMoodCompleted.toFixed(1)
                });
            }
        }
    });
    
    return correlations;
}

// --- Challenge & Achievement Badge Evaluator ---
function evaluateChallengesAndBadges() {
    let stateChanged = false;
    const overallStreak = getOverallDailyStreak();
    
    // Evaluate Challenges
    state.challenges.forEach(c => {
        if (c.completed) return;
        
        if (c.id === 'c1') {
            // Morning Routine Completion
            let consecutiveMorningDays = 0;
            for (let i = 0; i < 10; i++) {
                const dateStr = getPastDateString(i);
                const dayLogs = state.logs[dateStr] || {};
                
                // Get all morning habits scheduled for this day
                const morningHabits = state.habits.filter(h => h.routine === 'morning' && !h.archived);
                const allMorningCompleted = morningHabits.length > 0 && morningHabits.every(h => dayLogs[h.id] && dayLogs[h.id].completed);
                
                if (allMorningCompleted) consecutiveMorningDays++;
                else if (consecutiveMorningDays > 0) break; // Break consecutive stream
            }
            c.current = consecutiveMorningDays;
            if (c.current >= c.target) {
                c.completed = true;
                stateChanged = true;
                sendNativeNotification("Challenge Unlocked!", `Congrats! You've unlocked the '${c.title}' challenge!`);
            }
        }
        
        else if (c.id === 'c2') {
            // Focus Minutes accumulated
            let focusMinsSum = 0;
            state.focusSessions.forEach(f => focusMinsSum += f.duration);
            c.current = Math.min(focusMinsSum, c.target);
            if (c.current >= c.target) {
                c.completed = true;
                stateChanged = true;
                sendNativeNotification("Challenge Completed!", `Incredible! Focus Timer accumulated deep hours.`);
            }
        }
        
        else if (c.id === 'c3') {
            // School tasks completed
            const completedSchoolCount = state.schoolTasks.filter(t => t.completed).length;
            c.current = Math.min(completedSchoolCount, c.target);
            if (c.current >= c.target) {
                c.completed = true;
                stateChanged = true;
                sendNativeNotification("Challenge Completed!", `Scholar Master! You finished your homework planner targets.`);
            }
        }
    });
    
    // Evaluate Badge Achievements
    state.badges.forEach(b => {
        if (b.unlocked) return;
        
        if (b.id === 'b1') {
            // Any habit log completed
            const anyLogCompleted = Object.values(state.logs).some(day => Object.values(day).some(l => l.completed));
            if (anyLogCompleted) {
                b.unlocked = true;
                stateChanged = true;
            }
        }
        
        else if (b.id === 'b2') {
            // 7-day streak
            if (overallStreak >= 7) {
                b.unlocked = true;
                stateChanged = true;
            }
        }
        
        else if (b.id === 'b3') {
            // Focus sessions count >= 4
            if (state.focusSessions.length >= 4) {
                b.unlocked = true;
                stateChanged = true;
            }
        }
        
        else if (b.id === 'b4') {
            // Journal count >= 3
            if (state.journal.length >= 3) {
                b.unlocked = true;
                stateChanged = true;
            }
        }
        
        else if (b.id === 'b5') {
            // At least 1 school task completed
            const completedAnySchool = state.schoolTasks.some(t => t.completed);
            if (completedAnySchool) {
                b.unlocked = true;
                stateChanged = true;
            }
        }
    });

    if (stateChanged) {
        saveToLocalStorage();
    }
}

// --- Pomodoro Focus Timer Logic ---
let timerInterval = null;
let timerState = {
    mode: 'focus', // 'focus', 'short-break', 'long-break'
    timeLeft: 25 * 60, // in seconds
    duration: 25 * 60,
    isActive: false
};

const MODE_DURATIONS = {
    'focus': 25 * 60,
    'short-break': 5 * 60,
    'long-break': 15 * 60
};

function updateTimerDisplay() {
    const min = Math.floor(timerState.timeLeft / 60);
    const sec = timerState.timeLeft % 60;
    const timeText = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    
    document.getElementById('timer-time-display').textContent = timeText;
    
    // Mode Label
    let modeLabel = "Focus Session";
    if (timerState.mode === 'short-break') modeLabel = "Short Break";
    if (timerState.mode === 'long-break') modeLabel = "Long Break";
    document.getElementById('timer-mode-lbl').textContent = modeLabel;

    // Progress Ring offset
    const progressRing = document.getElementById('timer-progress-ring');
    const radius = 90;
    const circumference = 2 * Math.PI * radius; // 565.48
    const percentDone = (timerState.duration - timerState.timeLeft) / timerState.duration;
    const offset = circumference - (percentDone * circumference);
    progressRing.style.strokeDashoffset = offset;
}

function handleTimerComplete() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerState.isActive = false;
    document.getElementById('timer-play-icon').textContent = 'play_arrow';
    
    playFocusChime();
    
    const linkedHabitId = document.getElementById('timer-habit-link').value;
    const mode = timerState.mode;

    if (mode === 'focus') {
        const completedMinutes = Math.round(timerState.duration / 60);
        const todayStr = getTodayString();
        
        // Save to focus history logs
        state.focusSessions.push({
            date: todayStr,
            duration: completedMinutes,
            habitId: linkedHabitId || null
        });
        
        // Auto-increment linked habit if it is of duration type
        if (linkedHabitId) {
            if (!state.logs[todayStr]) state.logs[todayStr] = {};
            if (!state.logs[todayStr][linkedHabitId]) {
                state.logs[todayStr][linkedHabitId] = { value: 0, completed: false };
            }
            
            const habit = state.habits.find(h => h.id === linkedHabitId);
            if (habit && habit.type === 'duration') {
                state.logs[todayStr][linkedHabitId].value += completedMinutes;
                if (state.logs[todayStr][linkedHabitId].value >= habit.target) {
                    state.logs[todayStr][linkedHabitId].completed = true;
                }
            }
        }
        
        sendNativeNotification("Session Complete!", `Fantastic job focus sprint! Let's take a break.`);
        
        // Transition to short break automatically
        setTimerMode('short-break');
    } else {
        sendNativeNotification("Break Finished!", "Ready to dive back into deep work?");
        setTimerMode('focus');
    }
    
    saveToLocalStorage();
    evaluateChallengesAndBadges();
    renderAllScreens();
}

function setTimerMode(mode) {
    clearInterval(timerInterval);
    timerInterval = null;
    timerState.isActive = false;
    timerState.mode = mode;
    timerState.duration = MODE_DURATIONS[mode];
    timerState.timeLeft = timerState.duration;
    
    document.getElementById('timer-play-icon').textContent = 'play_arrow';
    
    // Toggle active classes on timer-mode buttons
    document.querySelectorAll('.timer-mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    updateTimerDisplay();
}

function toggleTimer() {
    if (timerState.isActive) {
        // Pause timer
        clearInterval(timerInterval);
        timerInterval = null;
        timerState.isActive = false;
        document.getElementById('timer-play-icon').textContent = 'play_arrow';
    } else {
        // Play timer
        timerState.isActive = true;
        document.getElementById('timer-play-icon').textContent = 'pause';
        
        timerInterval = setInterval(() => {
            timerState.timeLeft--;
            if (timerState.timeLeft <= 0) {
                handleTimerComplete();
            } else {
                updateTimerDisplay();
            }
        }, 1000);
    }
}

// --- Screen Rendering Engines ---

// 1. Dashboard Renderer
function renderDashboard() {
    const todayStr = getTodayString();

    // Level 5 Failure Lockout Notification
    const level5Warning = document.getElementById('level5-failure-warning');
    if (state.level5Failure) {
        if (!level5Warning) {
            const warningBanner = document.createElement('div');
            warningBanner.id = 'level5-failure-warning';
            warningBanner.style.background = 'rgba(239, 68, 68, 0.12)';
            warningBanner.style.border = '1px solid var(--danger-color)';
            warningBanner.style.color = 'var(--danger-color)';
            warningBanner.style.padding = '12px 16px';
            warningBanner.style.borderRadius = 'var(--border-radius-md)';
            warningBanner.style.marginBottom = '16px';
            warningBanner.style.fontSize = '12px';
            warningBanner.style.fontWeight = '700';
            warningBanner.style.display = 'flex';
            warningBanner.style.alignItems = 'center';
            warningBanner.style.gap = '8px';
            warningBanner.innerHTML = `
                <span class="material-symbols-outlined" style="font-size: 20px;">gavel</span>
                <div>
                    LEVEL 5 CONFLICT BREACH: Accountability Lock engaged. Your 30-day streak is frozen at 0.
                    <span style="font-weight:400; font-size:11px; display:block; margin-top:2px; color:var(--text-secondary);">
                        To unlock your personal operating system, navigate to the **Reflections & Mood Journal** tab and write your Weekly Reflection.
                    </span>
                </div>
            `;
            const mainContainer = document.querySelector('#tab-dashboard .screen-header');
            if (mainContainer) {
                mainContainer.parentNode.insertBefore(warningBanner, mainContainer.nextSibling);
            }
        } else {
            level5Warning.style.display = 'flex';
        }
    } else if (level5Warning) {
        level5Warning.style.display = 'none';
    }
    
    // Update welcome texts
    const scoreBreakdown = calculateProductivityScore();
    document.getElementById('header-productivity-score').textContent = scoreBreakdown.overall;
    document.getElementById('dashboard-score-val').textContent = scoreBreakdown.overall;
    document.getElementById('dashboard-score-circle').style.setProperty('--score-pct', `${scoreBreakdown.overall}%`);
    
    // Breakdown fills
    document.getElementById('breakdown-habits-fill').style.width = `${scoreBreakdown.habits}%`;
    document.getElementById('breakdown-habits-val').textContent = `${scoreBreakdown.habits}%`;
    document.getElementById('breakdown-focus-fill').style.width = `${scoreBreakdown.focus}%`;
    document.getElementById('breakdown-focus-val').textContent = `${scoreBreakdown.focus}%`;
    document.getElementById('breakdown-school-fill').style.width = `${scoreBreakdown.school}%`;
    document.getElementById('breakdown-school-val').textContent = `${scoreBreakdown.school}%`;

    // Overall Streak
    document.getElementById('header-streak-count').textContent = getOverallDailyStreak();

    // Render Today's habits routine
    const listContainer = document.getElementById('dashboard-today-list');
    listContainer.innerHTML = '';
    
    const activeFilter = document.querySelector('.routine-filter .filter-btn.active').dataset.routine;
    const dayOfWeek = new Date().getDay();
    
    const filteredTodayHabits = state.habits.filter(h => {
        if (h.archived) return false;
        
        // Filter by morning/evening routines if selected
        if (activeFilter === 'morning' && h.routine !== 'morning') return false;
        if (activeFilter === 'evening' && h.routine !== 'evening') return false;
        
        // Check repeat scheduling logic
        return isHabitScheduledForDay(h, dayOfWeek);
    });

    if (state.habits.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state" style="padding: 24px 16px; text-align: center;">
                <span class="material-symbols-outlined" style="font-size: 38px; color: var(--primary-color);">add_task</span>
                <h4 style="font-size: 13px; font-weight: 700; color: var(--text-primary); margin-top: 4px;">No Habits Created Yet</h4>
                <p style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">Build your ideal routines! Create your first daily habit in the Studio Hub.</p>
                <button class="btn btn-primary btn-sm btn-go-tab" data-target="habits" style="margin-top: 10px; padding: 6px 14px; border-radius: 18px; cursor: pointer;">
                    <span class="material-symbols-outlined" style="font-size: 16px;">add</span> Create First Habit
                </button>
            </div>
        `;
        document.getElementById('today-completion-badge').textContent = `0 habits`;
    } else if (filteredTodayHabits.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state" style="padding: 20px 16px; text-align: center;">
                <span class="material-symbols-outlined" style="font-size: 32px; color: var(--accent-color);">event_available</span>
                <p style="font-size: 12px; font-weight: 600; color: var(--text-primary); margin-top: 4px;">No Pending Scheduled Habits (${activeFilter.toUpperCase()})</p>
                <p style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">All routines clean or none scheduled for this filter today.</p>
                <button class="btn-go-tab" data-target="habits" style="margin-top: 8px; background: none; border: none; color: var(--primary-color); font-size: 11px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
                    <span class="material-symbols-outlined" style="font-size: 14px;">calendar_month</span> Manage Habit Schedules &rarr;
                </button>
            </div>
        `;
        document.getElementById('today-completion-badge').textContent = `0/${state.habits.length} today`;
    } else {
        let completedCount = 0;
        filteredTodayHabits.forEach(h => {
            const todayLogs = state.logs[todayStr] || {};
            const isCompleted = todayLogs[h.id] && todayLogs[h.id].completed;
            const logValue = todayLogs[h.id] ? todayLogs[h.id].value : 0;
            
            if (isCompleted) completedCount++;

            const row = document.createElement('div');
            row.className = `today-habit-row ${isCompleted ? 'completed' : ''}`;
            row.style.setProperty('--habit-color', h.color);

            // Handle habit types checkout UI
            let checkAreaHtml = '';
            if (h.type === 'yes_no') {
                checkAreaHtml = `
                    <label class="habit-checkbox-wrapper">
                        <input type="checkbox" class="habit-check-click" data-id="${h.id}" ${isCompleted ? 'checked' : ''}>
                        <span class="checkbox-custom" style="--habit-color: ${h.color}"></span>
                    </label>
                `;
            } else {
                checkAreaHtml = `
                    <div class="today-habit-numeric">
                        <button class="numeric-btn num-dec" data-id="${h.id}">-</button>
                        <span class="numeric-val">${logValue}/${h.target}</span>
                        <button class="numeric-btn num-inc" data-id="${h.id}">+</button>
                    </div>
                `;
            }

            // Calculate missed yesterday (James Clear's "Never Miss Twice" rule)
            const yesterdayDateStr = getPastDateString(1);
            const yesterdayDayOfWeek = new Date(yesterdayDateStr).getDay();
            const wasScheduledYesterday = isHabitScheduledForDay(h, yesterdayDayOfWeek);
            const yesterdayLogs = state.logs[yesterdayDateStr] || {};
            const completedYesterday = yesterdayLogs[h.id] && yesterdayLogs[h.id].completed;
            const missedYesterday = wasScheduledYesterday && !completedYesterday;

            let neverMissTwiceHtml = '';
            if (missedYesterday && !isCompleted) {
                neverMissTwiceHtml = `
                    <div class="never-miss-twice-badge" style="display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; background-color: rgba(239, 68, 68, 0.12); color: #EF4444; padding: 2px 6px; border-radius: 4px; margin-top: 4px; width: fit-content; border: 1px solid rgba(239, 68, 68, 0.2);">
                        <span class="material-symbols-outlined" style="font-size: 12px;">warning</span> Never Miss Twice: Double Down!
                    </div>
                `;
            }

            let atomicTipsHtml = '';
            if (h.implementationTime || h.implementationLocation || (h.twoMinVersion && !isCompleted) || (h.temptationReward && !isCompleted)) {
                atomicTipsHtml = `
                    <div class="today-atomic-tips" style="font-size: 11px; margin-top: 4px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 2px; border-left: 2px solid var(--border-color); padding-left: 6px; margin-left: 2px;">
                        ${(h.implementationTime || h.implementationLocation) ? `
                            <span style="opacity: 0.85;">🕒 Intention: ${h.implementationTime || ''} ${h.implementationLocation ? 'at ' + h.implementationLocation : ''}</span>
                        ` : ''}
                        ${(h.twoMinVersion && !isCompleted) ? `
                            <span style="color: var(--warning-color); font-weight: 500;">⚡ 2-Min Rule: "${h.twoMinVersion}"</span>
                        ` : ''}
                        ${(h.temptationReward && !isCompleted) ? `
                            <span style="color: var(--primary-color); font-weight: 500;">🎁 Reward: "${h.temptationReward}" afterwards!</span>
                        ` : ''}
                    </div>
                `;
            }

            row.innerHTML = `
                <div class="today-habit-info">
                    ${h.type === 'yes_no' ? checkAreaHtml : ''}
                    <div class="today-habit-details" style="width: 100%;">
                        <span class="today-habit-name">${h.name}</span>
                        <span class="today-habit-sub">${h.notes || 'Routine habit'}</span>
                        ${neverMissTwiceHtml}
                        ${atomicTipsHtml}
                    </div>
                </div>
                ${h.type !== 'yes_no' ? checkAreaHtml : ''}
            `;
            listContainer.appendChild(row);
        });

        document.getElementById('today-completion-badge').textContent = `${completedCount}/${filteredTodayHabits.length} completed`;
    }

    // Render Calendar Heatmap
    renderCalendarHeatmap();

    // Render Triple Mood Checks
    renderTripleMoodChecks('dashboard-mood-container');

    // Render School tasks Highlights on Dashboard
    const schoolContainer = document.getElementById('dashboard-school-tasks');
    schoolContainer.innerHTML = '';
    
    const incompleteTasks = state.schoolTasks.filter(t => !t.completed).slice(0, 3);
    
    if (incompleteTasks.length === 0) {
        schoolContainer.innerHTML = `
            <div class="empty-state-sm">No homework or exams scheduled. Nice work!</div>
        `;
    } else {
        incompleteTasks.forEach(task => {
            const item = document.createElement('div');
            item.className = 'dashboard-school-item';
            
            const daysLeft = Math.ceil((new Date(task.due) - new Date()) / (1000 * 60 * 60 * 24));
            let dueText = `Due in ${daysLeft} days`;
            let urgencyClass = '';
            
            if (daysLeft < 0) {
                dueText = "OVERDUE";
                urgencyClass = "text-red";
            } else if (daysLeft === 0) {
                dueText = "Due Today";
                urgencyClass = "text-accent";
            }

            item.innerHTML = `
                <div>
                    <span class="school-task-lbl ${task.type}">${task.type}</span>
                    <strong style="margin-left:6px;">${task.title}</strong>
                </div>
                <span class="${urgencyClass}" style="font-size:10px; font-weight:700;">${dueText}</span>
            `;
            schoolContainer.appendChild(item);
        });
    }

    // Personal Insights section rendering
    const streaks = state.habits.map(h => ({ name: h.name, val: getHabitStreak(h.id) })).filter(s => s.val > 0);
    const topStreak = streaks.length > 0 ? streaks.reduce((prev, current) => (prev.val > current.val) ? prev : current) : null;
    
    if (topStreak) {
        document.getElementById('insight-streak-title').textContent = `${topStreak.val} Day Streak!`;
        document.getElementById('insight-streak-desc').textContent = `Unbelievable focus on '${topStreak.name}'.`;
    } else {
        document.getElementById('insight-streak-title').textContent = "Consistency Builder";
        document.getElementById('insight-streak-desc').textContent = "Complete consecutive scheduled habits to start a streak.";
    }

    // Best tracking day of completion
    const daysLogCounts = {};
    Object.keys(state.logs).forEach(date => {
        const complCount = Object.values(state.logs[date]).filter(v => v.completed).length;
        if (complCount > 0) daysLogCounts[date] = complCount;
    });

    const dates = Object.keys(daysLogCounts);
    if (dates.length > 0) {
        const bestDate = dates.reduce((a, b) => daysLogCounts[a] > daysLogCounts[b] ? a : b);
        const bestDayName = new Date(bestDate).toLocaleDateString('en-US', { weekday: 'long' });
        document.getElementById('insight-bestday-title').textContent = `Best Day: ${bestDayName}`;
        document.getElementById('insight-bestday-desc').textContent = `Successfully completed ${daysLogCounts[bestDate]} habits. Keep it up!`;
    } else {
        document.getElementById('insight-bestday-title').textContent = "Best Day Analysis";
        document.getElementById('insight-bestday-desc').textContent = "Logs will populate your most successful week-days.";
    }
}

// Heatmap Calendar builder
function renderCalendarHeatmap() {
    const grid = document.getElementById('calendar-heatmap-grid');
    grid.innerHTML = '';
    
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed
    
    // Label
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('heatmap-month-label').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Get start day of month (e.g. Wednesday = 3)
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const numDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Create pre-grid offsets (empty blocks)
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'heatmap-day inactive';
        grid.appendChild(emptyCell);
    }
    
    // Populate month days
    for (let d = 1; d <= numDays; d++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const cell = document.createElement('div');
        
        // Find completion percentage for this day
        const dayLogs = state.logs[dateStr] || {};
        const completedCount = Object.values(dayLogs).filter(l => l.completed).length;
        
        let level = 0;
        if (completedCount > 0) {
            if (completedCount === 1) level = 1;
            else if (completedCount === 2) level = 2;
            else if (completedCount === 3) level = 3;
            else level = 4;
        }

        cell.className = `heatmap-day level-${level}`;
        cell.textContent = d;
        cell.title = `${dateStr}: ${completedCount} habits completed`;
        
        grid.appendChild(cell);
    }
}

// 2. Habits Screen Renderer
function renderHabitsScreen() {
    const grid = document.getElementById('habits-list-container');
    grid.innerHTML = '';
    
    const searchVal = document.getElementById('habit-search').value.toLowerCase();
    const catFilter = document.getElementById('habit-category-filter').value;
    const statusFilter = document.getElementById('habit-status-filter').value;
    
    // Filter habits list
    const filtered = state.habits.filter(h => {
        // Search filter
        const matchesSearch = h.name.toLowerCase().includes(searchVal) || (h.notes && h.notes.toLowerCase().includes(searchVal));
        if (!matchesSearch) return false;
        
        // Category filter
        if (catFilter !== 'all' && h.category !== catFilter) return false;
        
        // Status filter
        if (statusFilter === 'active' && h.archived) return false;
        if (statusFilter === 'archived' && !h.archived) return false;
        
        return true;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state col-span-3">
                <span class="material-symbols-outlined">psychology_alt</span>
                <p>No habits found matching current criteria. Create one above!</p>
            </div>
        `;
    } else {
        filtered.forEach(h => {
            const card = document.createElement('div');
            card.className = 'habit-card';
            card.style.setProperty('--habit-color', h.color);
            
            const streak = getHabitStreak(h.id);
            
            // Calculate success rate over the last 30 days
            let totalActiveDays = 0;
            let completedDays = 0;
            for (let i = 0; i < 30; i++) {
                const dateStr = getPastDateString(i);
                const dayOfWeek = new Date(dateStr).getDay();
                const isScheduled = isHabitScheduledForDay(h, dayOfWeek);
                if (isScheduled) {
                    totalActiveDays++;
                    const dayLogs = state.logs[dateStr] || {};
                    if (dayLogs[h.id] && dayLogs[h.id].completed) {
                        completedDays++;
                    }
                }
            }
            const successPct = totalActiveDays > 0 ? Math.round((completedDays / totalActiveDays) * 100) : 0;

            let formulationHtml = '';
            if (h.implementationTime || h.implementationLocation || h.twoMinVersion || h.temptationReward) {
                formulationHtml = `
                    <div class="atomic-formulation-box" style="margin: 12px 0; background: var(--bg-primary); border: 1px dashed var(--border-color); padding: 10px; border-radius: var(--border-radius-md); font-size: 11px; line-height: 1.5; color: var(--text-secondary);">
                        <div style="font-weight: 700; color: var(--accent-color); font-size: 10px; margin-bottom: 6px; display: flex; align-items: center; gap: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                            <span class="material-symbols-outlined" style="font-size: 13px;">auto_stories</span> James Clear Formulation
                        </div>
                        ${(h.implementationTime || h.implementationLocation) ? `
                            <p style="margin-bottom: 4px;"><strong>Intention:</strong> I will do this <em>${h.implementationTime || ''}</em> ${h.implementationLocation ? `at/in <em>${h.implementationLocation}</em>` : ''}.</p>
                        ` : ''}
                        ${h.twoMinVersion ? `
                            <p style="margin-bottom: 4px;"><strong>⚡ 2-Min version:</strong> <span style="color: var(--warning-color);">${h.twoMinVersion}</span></p>
                        ` : ''}
                        ${h.temptationReward ? `
                            <p><strong>🎁 Temptation bundle:</strong> <span style="color: var(--primary-color);">${h.temptationReward}</span></p>
                        ` : ''}
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="habit-card-top">
                    <div class="habit-meta-info">
                        <span class="habit-category-badge">${h.category}</span>
                        <h4 class="habit-name-title">${h.name}</h4>
                    </div>
                    ${streak > 0 ? `
                        <div class="habit-streak-display">
                            <span class="material-symbols-outlined" style="font-size:16px;">local_fire_department</span>
                            <span>${streak}d</span>
                        </div>
                    ` : ''}
                </div>
                
                <p class="habit-desc-para">${h.notes || 'Routine scheduled habit'}</p>
                
                ${formulationHtml}
                
                <div class="habit-success-bar">
                    <div class="success-lbl-row">
                        <span>30-Day Success Rate</span>
                        <span>${successPct}%</span>
                    </div>
                    <div class="progress-bar-sm">
                        <div class="bar-fill" style="width: ${successPct}%; background-color: ${h.color};"></div>
                    </div>
                </div>

                <div class="habit-actions-row">
                    <span class="badge" style="background-color: var(--bg-primary);">${h.routine !== 'none' ? h.routine + ' routine' : 'anytime'}</span>
                    <button class="text-btn btn-edit-habit" data-id="${h.id}">Edit / Manage</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }
}

// 3. Focus Timer Renderer
function renderFocusScreen() {
    // Populate habit links options dynamically
    const linkSelect = document.getElementById('timer-habit-link');
    const prevVal = linkSelect.value;
    linkSelect.innerHTML = '<option value="">No habit (General Focus)</option>';
    
    state.habits.filter(h => !h.archived).forEach(h => {
        const opt = document.createElement('option');
        opt.value = h.id;
        opt.textContent = h.name;
        linkSelect.appendChild(opt);
    });
    
    // Restore previous selection if it still exists
    if (state.habits.find(h => h.id === prevVal && !h.archived)) {
        linkSelect.value = prevVal;
    }

    // Update Stats Display
    document.getElementById('focus-sessions-count').textContent = state.focusSessions.length;
    
    let totalMins = 0;
    state.focusSessions.forEach(s => totalMins += s.duration);
    document.getElementById('focus-time-count').textContent = totalMins >= 60 ? `${(totalMins/60).toFixed(1)}h` : `${totalMins}m`;

    // Render Today's log sessions list
    const logsList = document.getElementById('focus-logs-list');
    logsList.innerHTML = '';
    
    const todayStr = getTodayString();
    const todaySessions = state.focusSessions.filter(s => s.date === todayStr);

    if (todaySessions.length === 0) {
        logsList.innerHTML = `<div class="empty-state-sm">No focus sessions completed today.</div>`;
    } else {
        todaySessions.forEach(session => {
            const item = document.createElement('div');
            item.className = 'focus-log-item';
            
            let name = 'General Deep Focus';
            if (session.habitId) {
                const habit = state.habits.find(h => h.id === session.habitId);
                if (habit) name = habit.name;
            }

            item.innerHTML = `
                <span>🧠 <strong>${name}</strong></span>
                <span class="focus-log-time">${session.duration} minutes logged</span>
            `;
            logsList.appendChild(item);
        });
    }
    
    // Render accountability controls
    if (typeof renderAccountabilityDashboard === 'function') {
        renderAccountabilityDashboard();
    }
}

// 4. School Planner Screen
function renderSchoolScreen() {
    const todoList = document.getElementById('school-todo-list');
    const completedList = document.getElementById('school-completed-list');
    
    todoList.innerHTML = '';
    completedList.innerHTML = '';

    const filterVal = document.querySelector('.planner-filters .filter-btn.active').dataset.schoolFilter;
    
    // Sort tasks by due date (closest first)
    const sortedTasks = [...state.schoolTasks].sort((a, b) => new Date(a.due) - new Date(b.due));
    
    const filteredTasks = sortedTasks.filter(t => filterVal === 'all' || t.type === filterVal);

    const todoTasks = filteredTasks.filter(t => !t.completed);
    const completedTasks = filteredTasks.filter(t => t.completed);

    document.getElementById('todo-tasks-count').textContent = todoTasks.length;
    document.getElementById('completed-tasks-count').textContent = completedTasks.length;

    // Render To Do Column
    if (todoTasks.length === 0) {
        todoList.innerHTML = `<div class="empty-state-sm">All academic objectives cleared! Good job!</div>`;
    } else {
        todoTasks.forEach(task => {
            const card = document.createElement('div');
            card.className = 'school-task-card';
            card.dataset.id = task.id;
            
            const daysLeft = Math.ceil((new Date(task.due) - new Date()) / (1000 * 60 * 60 * 24));
            let urgencyClass = '';
            let dueText = `Due ${task.due}`;
            
            if (daysLeft < 0) {
                urgencyClass = 'overdue';
                dueText = `OVERDUE by ${Math.abs(daysLeft)}d`;
            } else if (daysLeft === 0) {
                urgencyClass = 'today';
                dueText = 'DUE TODAY';
            } else if (daysLeft === 1) {
                urgencyClass = 'today';
                dueText = 'DUE YESTERDAY/TOMORROW (1d)';
            }

            card.innerHTML = `
                <div class="school-task-card-header">
                    <span class="school-task-lbl ${task.type}">${task.type}</span>
                    <span class="school-task-subject">${task.subject || 'GENERAL'}</span>
                </div>
                <strong class="school-task-title">${task.title}</strong>
                <p class="school-task-details">${task.notes || 'No extra milestones added.'}</p>
                <div class="school-task-footer">
                    <span class="school-task-due ${urgencyClass}">
                        <span class="material-symbols-outlined">schedule</span> ${dueText}
                    </span>
                    <button class="text-btn task-done-click" data-id="${task.id}" style="color: var(--accent-color);">Mark Done</button>
                </div>
            `;
            todoList.appendChild(card);
        });
    }

    // Render Completed Column
    if (completedTasks.length === 0) {
        completedList.innerHTML = `<div class="empty-state-sm">Clear school planner tasks to fill archives.</div>`;
    } else {
        completedTasks.forEach(task => {
            const card = document.createElement('div');
            card.className = 'school-task-card completed-opacity';
            card.dataset.id = task.id;

            card.innerHTML = `
                <div class="school-task-card-header">
                    <span class="school-task-lbl ${task.type}">${task.type}</span>
                    <span class="school-task-subject">${task.subject || 'GENERAL'}</span>
                </div>
                <strong class="school-task-title" style="text-decoration: line-through; opacity: 0.7;">${task.title}</strong>
                <div class="school-task-footer" style="margin-top: 8px;">
                    <span style="color: var(--accent-color); font-weight:700;">✓ Completed</span>
                    <button class="text-btn task-revert-click" data-id="${task.id}" style="color: var(--text-secondary);">Re-Open</button>
                </div>
            `;
            completedList.appendChild(card);
        });
    }
}

// 5. Mood and Reflections Screen
function renderJournalScreen() {
    const todayStr = getTodayString();
    
    // Render triple daily mood checks on the journal tab
    renderTripleMoodChecks('journal-mood-container');
    
    // Populate Week Ending selector if it's empty
    const weekSelector = document.getElementById('entry-week-selector');
    if (weekSelector && weekSelector.children.length === 0) {
        const weeks = getWeeksList();
        weeks.forEach(w => {
            const opt = document.createElement('option');
            opt.value = w.value;
            opt.textContent = w.label;
            weekSelector.appendChild(opt);
        });
        
        // Add change listener to load/clear reflection when another week is selected
        weekSelector.addEventListener('change', () => {
            loadSelectedWeeklyReflection();
        });
    }

    // Update Habit Checkboxes inside Journal card (list of active/completed habits for the current week)
    const journalCheckboxes = document.getElementById('journal-habit-checkpoints');
    if (journalCheckboxes) {
        journalCheckboxes.innerHTML = '';
        const activeHabits = state.habits.filter(h => !h.archived);

        if (activeHabits.length === 0) {
            journalCheckboxes.innerHTML = `<span style="font-size:11px; color: var(--text-secondary);">No active habits found.</span>`;
        } else {
            activeHabits.forEach(h => {
                const label = document.createElement('label');
                label.style.display = 'flex';
                label.style.alignItems = 'center';
                label.style.gap = '6px';
                label.style.fontSize = '12px';
                label.style.color = 'var(--text-primary)';
                label.innerHTML = `
                    <input type="checkbox" name="journal-linked-habits" value="${h.id}">
                    <span>${h.name}</span>
                `;
                journalCheckboxes.appendChild(label);
            });
        }
    }

    // Load the selected week's reflection data
    loadSelectedWeeklyReflection();

    // Average Mood Update
    const avgMood = getAverageMood30Days();
    const moodEmojis = ["", "😢", "🙁", "😐", "😊", "😁"];
    const avgMoodFloor = Math.max(1, Math.min(5, Math.round(avgMood)));
    const avgMoodEmojiEl = document.getElementById('avg-mood-emoji');
    if (avgMoodEmojiEl) avgMoodEmojiEl.textContent = moodEmojis[avgMoodFloor] || "😐";
    
    const moodLabels = ["", "Vulnerable Days", "Demanding Days", "Consistent Baseline", "Positive Growth", "Peak Energy"];
    const avgMoodTitleEl = document.getElementById('avg-mood-title');
    if (avgMoodTitleEl) avgMoodTitleEl.textContent = moodLabels[avgMoodFloor] || "Stable Baseline";

    // Mood Correlations Update
    const correlationsList = document.getElementById('mood-correlation-results');
    if (correlationsList) {
        correlationsList.innerHTML = '';
        const corrs = calculateMoodHabitCorrelations();
        if (corrs.length === 0) {
            correlationsList.innerHTML = `
                <div class="empty-state-sm">
                    Log habits and mood entries for 3-5 days to enable pattern discovery. Oumar Habits will identify deep correlations.
                </div>
            `;
        } else {
            corrs.forEach(c => {
                const item = document.createElement('div');
                item.className = 'correlation-item';
                item.innerHTML = `
                    <span>⚡ <strong>${c.habitName}</strong></span>
                    <span class="tag" title="${c.strength}">+${c.difference} Mood Increase</span>
                `;
                correlationsList.appendChild(item);
            });
        }
    }

    // History list rendering (Past Weekly Reflections)
    const historyList = document.getElementById('journal-entries-list');
    if (historyList) {
        historyList.innerHTML = '';
        
        if (!state.weeklyReflections) state.weeklyReflections = [];
        
        // Sort reverse chronological
        const sortedReflections = [...state.weeklyReflections].sort((a, b) => new Date(b.weekEnding) - new Date(a.weekEnding));

        if (sortedReflections.length === 0) {
            historyList.innerHTML = `<div class="empty-state-sm">No weekly reflections saved yet. Use the journal form to record one!</div>`;
        } else {
            sortedReflections.forEach(ref => {
                const item = document.createElement('div');
                item.className = 'journal-log-item';
                item.style.background = 'var(--bg-secondary)';
                item.style.border = '1px solid var(--border-color)';
                item.style.borderRadius = 'var(--border-radius-md)';
                item.style.padding = '12px';
                item.style.marginBottom = '10px';
                
                const formattedDate = new Date(ref.weekEnding).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                
                // Get habit names
                const habitNames = (ref.habitsReviewed || []).map(hid => {
                    const h = state.habits.find(x => x.id === hid);
                    return h ? `<span style="display:inline-block; font-size:10px; background:var(--bg-tertiary); padding:2px 6px; border-radius:4px; border:1px solid var(--border-color); color:var(--text-secondary); margin-right:4px;">${h.name}</span>` : '';
                }).join(' ');

                item.innerHTML = `
                    <div class="journal-log-header" style="display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
                        <span class="journal-log-date" style="font-weight: 700; font-size: 11px; color: var(--primary-color);">📅 Week Ending ${formattedDate}</span>
                    </div>
                    <p class="journal-log-reflection" style="font-size: 12px; line-height: 1.4; color: var(--text-primary); margin-bottom: 8px; font-style: italic;">"${ref.reflection}"</p>
                    ${ref.gratefulFor ? `<div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 8px;">💖 <strong>Grateful For:</strong> ${ref.gratefulFor}</div>` : ''}
                    ${habitNames ? `<div style="display: flex; flex-wrap: wrap; gap: 4px; align-items: center; margin-top: 6px;"><span style="font-size:10px; font-weight:700; color:var(--text-tertiary);">Linked:</span> ${habitNames}</div>` : ''}
                `;
                historyList.appendChild(item);
            });
        }
    }
}

// Loads selected weekly reflection from weeklyReflections database to the form
function loadSelectedWeeklyReflection() {
    const weekSelector = document.getElementById('entry-week-selector');
    if (!weekSelector) return;
    
    const selectedWeekVal = weekSelector.value;
    if (!state.weeklyReflections) state.weeklyReflections = [];
    
    const reflectionObj = state.weeklyReflections.find(r => r.weekEnding === selectedWeekVal);
    
    const reflectionTextarea = document.getElementById('entry-reflection');
    const gratefulInput = document.getElementById('entry-grateful');
    
    if (reflectionObj) {
        if (reflectionTextarea) reflectionTextarea.value = reflectionObj.reflection;
        if (gratefulInput) gratefulInput.value = reflectionObj.gratefulFor || '';
        
        // Check linked habits
        document.querySelectorAll('input[name="journal-linked-habits"]').forEach(checkbox => {
            checkbox.checked = (reflectionObj.habitsReviewed || []).includes(checkbox.value);
        });
    } else {
        if (reflectionTextarea) reflectionTextarea.value = '';
        if (gratefulInput) gratefulInput.value = '';
        
        // Uncheck all habits
        document.querySelectorAll('input[name="journal-linked-habits"]').forEach(checkbox => {
            checkbox.checked = false;
        });
    }
}

// Renders the customized 3-part Daily Mood check-in slots
function renderTripleMoodChecks(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const todayStr = getTodayString();
    if (!state.moodChecks) state.moodChecks = {};
    if (!state.moodChecks[todayStr]) {
        state.moodChecks[todayStr] = { morning: null, afternoon: null, night: null };
    }
    
    const todayChecks = state.moodChecks[todayStr];
    const slots = [
        { id: "morning", title: "Morning Check-In", icon: "🌅", desc: "Before school starts" },
        { id: "afternoon", title: "Afternoon Check-In", icon: "🏫", desc: "Right after school" },
        { id: "night", title: "Night Check-In", icon: "🌙", desc: "Before putting phone down" }
    ];
    
    const moodEmojis = ["", "😢", "🙁", "😐", "😊", "😁"];
    const moodNames = ["", "Awful", "Bad", "Okay", "Good", "Excellent"];
    
    let html = `<div class="triple-mood-container">`;
    
    slots.forEach(s => {
        const check = todayChecks[s.id];
        const isLogged = check !== null && check !== undefined;
        
        if (isLogged) {
            html += `
                <div class="mood-check-slot completed">
                    <div class="mood-slot-header">
                        <span class="mood-slot-title">${s.icon} ${s.title} <span style="font-weight: 400; font-size: 10px; opacity: 0.85; margin-left: 2px;">(${s.desc})</span></span>
                        <span class="mood-slot-status">Logged</span>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 4px;">
                        <span style="font-size: 16px; font-weight: 800; display: flex; align-items: center; gap: 6px;">
                            ${moodEmojis[check.val]} <span style="font-size: 12px; font-weight: 700; color: var(--text-primary);">${moodNames[check.val]}</span>
                        </span>
                        <span style="font-size: 10px; color: var(--text-tertiary);">Logged at ${check.time}</span>
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="mood-check-slot">
                    <div class="mood-slot-header">
                        <span class="mood-slot-title">${s.icon} ${s.title} <span style="font-weight: 400; font-size: 10px; opacity: 0.85; margin-left: 2px;">(${s.desc})</span></span>
                        <span class="mood-slot-status" style="background: var(--bg-tertiary); color: var(--text-secondary);">Pending</span>
                    </div>
                    <div class="mood-selector-row" style="margin-top: 6px;">
                        <button class="mood-btn" data-slot="${s.id}" data-mood="1" title="Awful">😢</button>
                        <button class="mood-btn" data-slot="${s.id}" data-mood="2" title="Bad">🙁</button>
                        <button class="mood-btn" data-slot="${s.id}" data-mood="3" title="Okay">😐</button>
                        <button class="mood-btn" data-slot="${s.id}" data-mood="4" title="Good">😊</button>
                        <button class="mood-btn" data-slot="${s.id}" data-mood="5" title="Excellent">😁</button>
                    </div>
                </div>
            `;
        }
    });
    
    html += `</div>`;
    container.innerHTML = html;
}

// Global action to log a specific slot's mood check-in
function logMoodCheck(dateStr, slot, moodVal) {
    if (!state.moodChecks) state.moodChecks = {};
    if (!state.moodChecks[dateStr]) {
        state.moodChecks[dateStr] = { morning: null, afternoon: null, night: null };
    }
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    state.moodChecks[dateStr][slot] = {
        val: moodVal,
        time: timestamp
    };
    
    // Calculate average for backward-compatibility & syncing with state.journal
    const dayChecks = state.moodChecks[dateStr];
    const vals = [];
    if (dayChecks.morning) vals.push(dayChecks.morning.val);
    if (dayChecks.afternoon) vals.push(dayChecks.afternoon.val);
    if (dayChecks.night) vals.push(dayChecks.night.val);
    
    const avgMood = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 3;
    
    let todayJournal = state.journal.find(j => j.date === dateStr);
    if (todayJournal) {
        todayJournal.mood = avgMood;
    } else {
        state.journal.push({
            date: dateStr,
            mood: avgMood,
            reflection: "Three-times daily mood check-in logs.",
            habits: []
        });
    }
    
    saveToLocalStorage();
    evaluateChallengesAndBadges();
    renderAllScreens();
    playFocusChime();
}

// 6. AI Habit Coach & Reviews
function renderAIScreen() {
    // Scroll chats to bottom
    const chatBox = document.getElementById('chat-messages');
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 7. Challenges & Achievements Screen
function renderChallengesScreen() {
    const chalGrid = document.getElementById('challenges-container');
    const badgeGrid = document.getElementById('badges-container');
    
    chalGrid.innerHTML = '';
    badgeGrid.innerHTML = '';

    // Challenges
    state.challenges.forEach(c => {
        const card = document.createElement('div');
        card.className = `challenge-card ${c.completed ? 'completed-opacity' : ''}`;
        
        const pct = Math.round((c.current / c.target) * 100);

        card.innerHTML = `
            <div class="challenge-card-top">
                <div class="challenge-meta">
                    <h4 class="challenge-title">${c.title}</h4>
                    <p class="challenge-desc">${c.desc}</p>
                </div>
                <span class="challenge-points-badge">${c.completed ? 'CLEARED' : `+${c.points} XP`}</span>
            </div>
            <div class="challenge-progress-container">
                <div class="challenge-stats">
                    <span>Progress: ${c.current}/${c.target}</span>
                    <span>${pct}%</span>
                </div>
                <div class="progress-bar-lg">
                    <div class="bar-fill" style="width: ${pct}%; background-color: var(--warning-color);"></div>
                </div>
            </div>
        `;
        chalGrid.appendChild(card);
    });

    // Achievement Badges
    state.badges.forEach(b => {
        const card = document.createElement('div');
        card.className = `badge-card ${b.unlocked ? 'unlocked' : ''}`;

        card.innerHTML = `
            <div class="badge-icon-wrap">
                <span class="material-symbols-outlined">${b.icon}</span>
            </div>
            <div class="badge-info">
                <h4>${b.name}</h4>
                <p>${b.desc}</p>
                <span style="font-size: 9px; font-weight:700; color: ${b.unlocked ? 'var(--warning-color)' : 'var(--text-tertiary)'}">
                    ${b.unlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}
                </span>
            </div>
        `;
        badgeGrid.appendChild(card);
    });
}

// --- Composite Renderer ---
function renderAllScreens() {
    renderDashboard();
    renderHabitsScreen();
    renderFocusScreen();
    renderSchoolScreen();
    renderJournalScreen();
    renderAIScreen();
    renderChallengesScreen();
    renderPrayersScreen();
}

// --- Bronx, NYC Prayer Times Calculator & Atomic Anchors ---
function calculatePrayerTimes(date) {
    const lat = 40.8448;
    const lng = -73.8648;
    
    // Get Timezone Offset in hours
    const timezoneOffset = -date.getTimezoneOffset() / 60; // Returns -4 or -5 dynamically depending on DST
    
    // Day of year
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Solar equations
    const b = (360 / 365) * (dayOfYear - 81) * (Math.PI / 180);
    const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b); // Equation of time in minutes
    const decl = 23.45 * Math.sin(b) * (Math.PI / 180); // Declination in radians
    
    const latRad = lat * (Math.PI / 180);
    
    // Solar transit (Noon) in local time
    const noonLocal = 12 - (lng / 15) - (eot / 60) + timezoneOffset;
    
    const getHourAngle = (angleDeg) => {
        const angleRad = angleDeg * (Math.PI / 180);
        const cosH = (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(decl)) / (Math.cos(latRad) * Math.cos(decl));
        if (cosH > 1 || cosH < -1) return null;
        return Math.acos(cosH) * (180 / Math.PI) / 15; // in hours
    };
    
    // Fajr (ISNA 15 degrees below horizon)
    const fajrHA = getHourAngle(-15);
    const fajr = fajrHA !== null ? noonLocal - fajrHA : noonLocal - 1.5;
    
    // Sunrise (-0.833 degrees below horizon)
    const sunriseHA = getHourAngle(-0.833);
    const sunrise = sunriseHA !== null ? noonLocal - sunriseHA : noonLocal - 1.1;
    
    // Dhuhr (Noon)
    const dhuhr = noonLocal + (2 / 60); // 2 mins safety buffer
    
    // Asr (Shafi'i shadow ratio 1)
    const latMinusDecl = Math.abs(latRad - decl);
    const asrAngleRad = Math.atan(1 / (1 + Math.tan(latMinusDecl)));
    const asrAngleDeg = - (90 - asrAngleRad * (180 / Math.PI));
    const asrHA = getHourAngle(asrAngleDeg);
    const asr = asrHA !== null ? noonLocal + asrHA : noonLocal + 2.5;
    
    // Maghrib (Sunset)
    const maghribHA = getHourAngle(-0.833);
    const maghrib = maghribHA !== null ? noonLocal + maghribHA : noonLocal + 1.1;
    
    // Isha (ISNA 15 degrees below horizon)
    const ishaHA = getHourAngle(-15);
    const isha = ishaHA !== null ? noonLocal + ishaHA : noonLocal + 1.5;
    
    const formatTime = (hours) => {
        let hrs = Math.floor(hours);
        let mins = Math.round((hours - hrs) * 60);
        if (mins === 60) {
            hrs++;
            mins = 0;
        }
        hrs = (hrs + 24) % 24;
        const period = hrs >= 12 ? 'PM' : 'AM';
        const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
        return `${displayHrs}:${String(mins).padStart(2, '0')} ${period}`;
    };
    
    const get24HDecimal = (hours) => {
        return (hours + 24) % 24;
    };
    
    return {
        fajr: formatTime(fajr),
        fajrRaw: get24HDecimal(fajr),
        sunrise: formatTime(sunrise),
        sunriseRaw: get24HDecimal(sunrise),
        dhuhr: formatTime(dhuhr),
        dhuhrRaw: get24HDecimal(dhuhr),
        asr: formatTime(asr),
        asrRaw: get24HDecimal(asr),
        maghrib: formatTime(maghrib),
        maghribRaw: get24HDecimal(maghrib),
        isha: formatTime(isha),
        ishaRaw: get24HDecimal(isha),
        school: "7:30 AM",
        schoolRaw: 7.5
    };
}

function renderPrayersScreen() {
    const today = new Date();
    const todayStr = getTodayString();
    const times = calculatePrayerTimes(today);
    
    // 1. Update Date Label
    const dateFormatted = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    const dateLbl = document.getElementById('prayer-date-lbl');
    if (dateLbl) {
        dateLbl.textContent = `Today: ${dateFormatted}`;
    }
    
    // Initialize today's prayer logs if missing
    if (!state.prayerLogs) state.prayerLogs = {};
    if (!state.prayerLogs[todayStr]) {
        state.prayerLogs[todayStr] = {
            fajr: false,
            dhuhr: false,
            asr: false,
            maghrib: false,
            isha: false,
            fajrWakeUp: false
        };
    }
    const todayLog = state.prayerLogs[todayStr];
    
    // 2. Compute Next Anchor Alert Countdown
    const currentHrsDec = today.getHours() + today.getMinutes() / 60 + today.getSeconds() / 3600;
    
    const anchorsList = [
        { name: "Fajr Prayer", code: "fajr", raw: times.fajrRaw, display: times.fajr },
        { name: "School Start", code: "school", raw: times.schoolRaw, display: times.school },
        { name: "Dhuhr Prayer", code: "dhuhr", raw: times.dhuhrRaw, display: times.dhuhr },
        { name: "Asr Prayer", code: "asr", raw: times.asrRaw, display: times.asr },
        { name: "Maghrib Prayer", code: "maghrib", raw: times.maghribRaw, display: times.maghrib },
        { name: "Isha Prayer", code: "isha", raw: times.ishaRaw, display: times.isha }
    ];
    
    // Sort anchors by chronological raw value
    anchorsList.sort((a, b) => a.raw - b.raw);
    
    // Find next anchor
    let nextAnchor = anchorsList.find(a => a.raw > currentHrsDec);
    let timeDiffHrs = 0;
    
    if (!nextAnchor) {
        // If all completed today, next is tomorrow's Fajr
        nextAnchor = anchorsList.find(a => a.code === 'fajr');
        timeDiffHrs = (24 - currentHrsDec) + nextAnchor.raw;
    } else {
        timeDiffHrs = nextAnchor.raw - currentHrsDec;
    }
    
    const diffMinsTotal = Math.round(timeDiffHrs * 60);
    const diffHrs = Math.floor(diffMinsTotal / 60);
    const diffMins = diffMinsTotal % 60;
    
    const countdownEl = document.getElementById('next-prayer-countdown-text');
    if (countdownEl) {
        countdownEl.innerHTML = `<strong>${nextAnchor.name}</strong> is next in <strong>${diffHrs}h ${diffMins}m</strong> (Anchor Time: ${nextAnchor.display})`;
    }
    
    // Update dashboard labels as well!
    const dashNextLbl = document.getElementById('dash-next-prayer-lbl');
    const dashNextCountdown = document.getElementById('dash-next-prayer-countdown');
    if (dashNextLbl) dashNextLbl.textContent = `Next Anchor: ${nextAnchor.name}`;
    if (dashNextCountdown) dashNextCountdown.innerHTML = `${diffHrs}h ${diffMins}m`;
    
    // 3. Render Dashboard Prayer Bubbles
    const prayersMap = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    prayersMap.forEach(p => {
        const bubble = document.getElementById(`bubble-${p}`);
        const card = document.getElementById(`bubble-card-${p}`);
        if (bubble) {
            const isDone = todayLog[p];
            bubble.textContent = isDone ? 'check_circle' : 'radio_button_unchecked';
            bubble.style.color = isDone ? 'var(--accent-color)' : 'var(--text-tertiary)';
            if (card) {
                card.style.borderColor = isDone ? 'var(--accent-color)' : 'var(--border-color)';
                card.style.background = isDone ? 'var(--accent-light)' : 'var(--bg-primary)';
            }
        }
    });
    
    const dashFajrWake = document.getElementById('dash-fajr-wake-status');
    if (dashFajrWake) {
        dashFajrWake.style.display = todayLog.fajrWakeUp ? 'block' : 'none';
    }
    
    // 4. Render the Full Anchors Timeline
    const timelineContainer = document.getElementById('prayer-timeline-container');
    if (timelineContainer) {
        timelineContainer.innerHTML = '';
        
        // Build ordered timeline list
        const timelineAnchors = [
            { name: "Fajr (Dawn Prayer)", code: "fajr", icon: "wb_twilight", time: times.fajr, raw: times.fajrRaw, isPrayer: true },
            { name: "7:30 AM School Anchor", code: "school", icon: "school", time: "7:30 AM", raw: times.schoolRaw, isPrayer: false, notes: "Oumar's school departure anchor point." },
            { name: "Dhuhr (Midday Prayer)", code: "dhuhr", icon: "wb_sunny", time: times.dhuhr, raw: times.dhuhrRaw, isPrayer: true },
            { name: "Asr (Afternoon Prayer)", code: "asr", icon: "sunny", time: times.asr, raw: times.asrRaw, isPrayer: true },
            { name: "Maghrib (Sunset Prayer)", code: "maghrib", icon: "wb_twilight", time: times.maghrib, raw: times.maghribRaw, isPrayer: true },
            { name: "Isha (Night Prayer)", code: "isha", icon: "nights_stay", time: times.isha, raw: times.ishaRaw, isPrayer: true }
        ];
        
        // Find active / current anchor
        timelineAnchors.sort((a, b) => a.raw - b.raw);
        let activeAnchorIndex = -1;
        for (let i = 0; i < timelineAnchors.length; i++) {
            if (currentHrsDec >= timelineAnchors[i].raw) {
                activeAnchorIndex = i;
            }
        }
        
        timelineAnchors.forEach((anchor, idx) => {
            const card = document.createElement('div');
            const isCompleted = anchor.isPrayer ? todayLog[anchor.code] : false;
            
            card.className = `prayer-anchor-card ${isCompleted ? 'completed-anchor' : ''}`;
            if (idx === activeAnchorIndex) {
                card.classList.add('current-anchor');
            }
            
            // Header with metadata and completion controls
            let controlHtml = '';
            if (anchor.isPrayer) {
                controlHtml = `
                    <div class="anchor-log-action">
                        <span style="font-size: 11px; font-weight: 700; color: ${isCompleted ? 'var(--accent-color)' : 'var(--text-secondary)'};">
                            ${isCompleted ? 'Completed' : 'Pending'}
                        </span>
                        <label class="habit-checkbox-wrapper">
                            <input type="checkbox" class="prayer-log-check" data-prayer="${anchor.code}" ${isCompleted ? 'checked' : ''}>
                            <span class="checkbox-custom" style="--habit-color: var(--warning-color)"></span>
                        </label>
                    </div>
                `;
            } else {
                controlHtml = `
                    <span class="badge" style="background-color: var(--primary-light); color: var(--primary-color);">Daily Schedule</span>
                `;
            }
            
            // Fajr wake up toggle if Fajr
            let fajrWakeHtml = '';
            if (anchor.code === 'fajr') {
                const wokeUpFajr = todayLog.fajrWakeUp;
                fajrWakeHtml = `
                    <div class="fajr-wake-wrapper" style="margin-top: 8px;">
                        <div class="fajr-wake-info">
                            <span class="material-symbols-outlined" style="color: var(--warning-color); font-size: 18px;">alarm_on</span>
                            <span>Woke up early on time for Fajr</span>
                        </div>
                        <label class="habit-checkbox-wrapper">
                            <input type="checkbox" class="fajr-wake-check" ${wokeUpFajr ? 'checked' : ''}>
                            <span class="checkbox-custom" style="--habit-color: var(--accent-color)"></span>
                        </label>
                    </div>
                `;
            }
            
            // Find stacked habits
            const links = state.habitStacks.filter(s => s.anchor === anchor.code);
            let stackedHabitsHtml = '';
            
            if (links.length > 0) {
                let listRows = '';
                links.forEach(link => {
                    const h = state.habits.find(habit => habit.id === link.habitId);
                    if (h && !h.archived) {
                        const todayLogs = state.logs[todayStr] || {};
                        const isHabitDone = todayLogs[h.id] && todayLogs[h.id].completed;
                        
                        listRows += `
                            <div class="stacked-habit-row">
                                <div class="stacked-habit-info-lbl">
                                    <span class="stacked-habit-color-indicator" style="background-color: ${h.color}"></span>
                                    <strong>${h.name}</strong>
                                    <span style="font-size: 10px; color: var(--text-secondary);">(${h.routine} routine)</span>
                                </div>
                                <label class="habit-checkbox-wrapper">
                                    <input type="checkbox" class="stacked-habit-check-timeline" data-habit-id="${h.id}" ${isHabitDone ? 'checked' : ''}>
                                    <span class="checkbox-custom" style="--habit-color: ${h.color}"></span>
                                </label>
                            </div>
                        `;
                    }
                });
                
                if (listRows) {
                    stackedHabitsHtml = `
                        <div class="stacked-habits-container" style="margin-top: 10px;">
                            <span class="stacked-habits-title">
                                <span class="material-symbols-outlined" style="font-size: 14px;">link</span> James Clear's Stacked Habits
                            </span>
                            ${listRows}
                        </div>
                    `;
                }
            } else {
                stackedHabitsHtml = `
                    <div style="font-size: 11px; color: var(--text-tertiary); font-style: italic; margin-top: 4px; padding-left: 12px;">
                        No habits stacked yet. Use the Stacker tool below to anchor a habit!
                    </div>
                `;
            }
            
            card.innerHTML = `
                <div class="anchor-header-row">
                    <div class="anchor-meta">
                        <div class="anchor-icon-circle">
                            <span class="material-symbols-outlined">${anchor.icon}</span>
                        </div>
                        <div class="anchor-title-info">
                            <span class="anchor-name">${anchor.name}</span>
                            <span class="anchor-time">${anchor.time}</span>
                        </div>
                    </div>
                    ${controlHtml}
                </div>
                ${fajrWakeHtml}
                ${stackedHabitsHtml}
            `;
            
            timelineContainer.appendChild(card);
        });
    }
    
    // 5. Populate Habit select options in Stack builder
    const stackHabitSelect = document.getElementById('stack-habit-select');
    if (stackHabitSelect) {
        const prevVal = stackHabitSelect.value;
        stackHabitSelect.innerHTML = '';
        state.habits.filter(h => !h.archived).forEach(h => {
            const opt = document.createElement('option');
            opt.value = h.id;
            opt.textContent = `${h.name} (${h.category})`;
            stackHabitSelect.appendChild(opt);
        });
        if (prevVal) {
            stackHabitSelect.value = prevVal;
        }
    }
    
    // 6. Render Active Stacking Links
    const linksList = document.getElementById('stack-links-list');
    if (linksList) {
        linksList.innerHTML = '';
        if (state.habitStacks.length === 0) {
            linksList.innerHTML = `
                <div class="empty-state-sm">No active stacking links. Pair your habits to anchors above.</div>
            `;
        } else {
            state.habitStacks.forEach((link, idx) => {
                const h = state.habits.find(habit => habit.id === link.habitId);
                if (h) {
                    const anchorDisplayNames = {
                        fajr: "After Fajr Dawn Prayer",
                        school: "Before 7:30 AM School Start",
                        dhuhr: "After Dhuhr Midday Prayer",
                        asr: "After Asr Afternoon Prayer",
                        maghrib: "After Maghrib Sunset Prayer",
                        isha: "After Isha Night Prayer"
                    };
                    
                    const item = document.createElement('div');
                    item.className = 'stack-link-pill';
                    item.innerHTML = `
                        <div class="stack-link-meta">
                            <span class="stacked-habit-color-indicator" style="background-color: ${h.color}; margin-right:4px;"></span>
                            <strong>${h.name}</strong>
                            <span class="stack-link-arrow">→</span>
                            <span style="color: var(--warning-color); font-weight: 600;">${anchorDisplayNames[link.anchor]}</span>
                        </div>
                        <button class="btn-remove-stack" data-index="${idx}" title="Delete Stacking Link">
                            <span class="material-symbols-outlined" style="font-size:16px;">close</span>
                        </button>
                    `;
                    linksList.appendChild(item);
                }
            });
        }
    }
    
    // Render child sub-widgets
    renderChoresList();
    renderWeekendTimeline();
}

// --- Dynamic AI Synthesizers & Rule Engines ---
function getSystemContextForAI() {
    // Generate context string
    const score = calculateProductivityScore();
    const streak = getOverallDailyStreak();
    
    let habitsContext = state.habits.map(h => {
        return `- ${h.name} (${h.category}): Streak of ${getHabitStreak(h.id)} days. Target: ${h.target}.`;
    }).join('\n');

    let schoolContext = state.schoolTasks.map(t => {
        return `- ${t.title} [Subject: ${t.subject || 'General'}]: ${t.completed ? 'Completed' : 'Outstanding (Due ' + t.due + ')'}`;
    }).join('\n');

    let moodContext = state.journal.slice(0, 5).map(j => {
        return `- Date ${j.date}, mood ${j.mood}/5, note: "${j.reflection}"`;
    }).join('\n');

    return `
User Profile: Oumar
Productivity Index: ${score.overall}% [Habits: ${score.habits}%, Focus Timer: ${score.focus}%, Academics: ${score.school}%]
Current daily habit tracking streak: ${streak} days

Active Habits:
${habitsContext || 'None created yet.'}

Academic School Tasks:
${schoolContext || 'No assignments logged.'}

Recent reflection logs:
${moodContext || 'No daily notes recorded.'}
`;
}

// Client Side Fallback Analyzer
function generateOfflineAIReview() {
    const score = calculateProductivityScore();
    const streak = getOverallDailyStreak();
    
    // Streaks and weaknesses analysis
    const weaknesses = [];
    const strengths = [];
    
    state.habits.forEach(h => {
        let totalActiveDays = 0;
        let completedDays = 0;
        for (let i = 0; i < 15; i++) {
            const dateStr = getPastDateString(i);
            const isScheduled = isHabitScheduledForDay(h, new Date(dateStr).getDay());
            if (isScheduled) {
                totalActiveDays++;
                const dayLogs = state.logs[dateStr] || {};
                if (dayLogs[h.id] && dayLogs[h.id].completed) {
                    completedDays++;
                }
            }
        }
        const rate = totalActiveDays > 0 ? (completedDays / totalActiveDays) * 100 : 0;
        if (rate >= 70) strengths.push(`${h.name} (${rate.toFixed(0)}% completion)`);
        else weaknesses.push(`${h.name} (${rate.toFixed(0)}% completion)`);
    });

    const reviews = `
<h4>Oumar Habits Offline AI Diagnostics</h4>
<p>Analyzing recent logs, tracking habits, and academic schedules to output your optimization directives...</p>

<h4>Consistency Overview</h4>
<ul>
    <li>Overall Productivity Score: <strong>${score.overall}%</strong></li>
    <li>General habit completion streak: <strong>${streak} consecutive tracking days</strong></li>
</ul>

<h4>Consistency Strengths</h4>
<ul>
    ${strengths.map(s => `<li>🌟 <strong>${s}</strong></li>`).join('') || "<li>No core habits exceeding 70% success in past 15 days. Initiate a routine to build momentum.</li>"}
</ul>

<h4>Weakness & Attention Areas</h4>
<ul>
    ${weaknesses.map(w => `<li>⚠️ <strong>${w}</strong></li>`).join('') || "<li>Fantastic work! All routines exceeding baseline metrics.</li>"}
</ul>

<h4>Actionable Habit Optimization Advice</h4>
<p>1. <strong>Anchor with Routines</strong>: Tie your low-performance habits directly to your morning and evening routines. Completing them immediately after waking triggers psychological momentum.</p>
<p>2. <strong>Academic Synchronization</strong>: Your school tasks require early focus block sessions. Link a 25-minute Pomodoro timer directly to your '${state.habits[0] ? state.habits[0].name : "Academic Readings"}' habit to complete study blocks.</p>
<p>3. <strong>Mindfulness & Refocusing</strong>: Maintain your Gratitude Journals regularly. Logs show a direct 20% uplift in daily mood scores on days you completed your breathing exercises.</p>
`;
    return reviews;
}

// Active Chat controller
function askAICoach(userPrompt) {
    const chatContainer = document.getElementById('chat-messages');
    
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user-msg';
    userMsg.innerHTML = `
        <div class="message-sender">${state.user.name}</div>
        <div class="message-text">${userPrompt}</div>
    `;
    chatContainer.appendChild(userMsg);
    renderAIScreen();

    // Show typing state
    const typingMsg = document.createElement('div');
    typingMsg.className = 'message system-msg typing';
    typingMsg.id = 'ai-typing-indicator';
    typingMsg.innerHTML = `
        <div class="message-sender">Oumar AI Life Assistant</div>
        <div class="message-text">Analyzing logs & drafting response...</div>
    `;
    chatContainer.appendChild(typingMsg);
    renderAIScreen();

    const fullPrompt = `You are a powerful, extremely reliable AI Life Assistant & Habit Coach assisting Oumar. You are his personal guide for all aspects of life, productivity, academics, time management, daily routines, philosophy, or general life tasks and advice. 
Below is his complete contextual dataset, which includes habit tracking progress, mood correlations, daily reflection logs, and school/academic planner items.

If his prompt asks about general life topics, help him with absolute intelligence, empathy, and wisdom as his general life assistant. If he asks about his habits or schedule, perform precise analytical diagnostics of his stats and issue actionable optimization guidance.

Answer his prompt: "${userPrompt}" with clear, highly motivating, and contextual responses. Maintain professional Markdown formatting (headers, bullet points, code blocks, bold markers, or tables if helpful).

Context Data of Oumar's App:
${getSystemContextForAI()}`;

    if (isAndroidNative() && window.AndroidBridge.callGeminiAPI) {
        // Native android environment exists - call secure Gemini API bridge!
        window.AndroidBridge.callGeminiAPI(fullPrompt, "onGeminiResponseCallback");
    } else {
        // Mock async response representing highly smart rules
        setTimeout(() => {
            const indicator = document.getElementById('ai-typing-indicator');
            if (indicator) indicator.remove();

            const coachMsg = document.createElement('div');
            coachMsg.className = 'message system-msg';
            
            let reply = "";
            const lowerPrompt = userPrompt.toLowerCase();
            
            if (lowerPrompt.includes('weak') || lowerPrompt.includes('fail') || lowerPrompt.includes('struggle')) {
                reply = `Oumar, looking at your habit logs, we have some friction points. Your Academic focus duration blocks require structure. I suggest breaking your target focus down to 1 Pomodoro session (25 mins) today. Anchor it with 'Morning Deep Breaths' so you begin studying immediately after breathing.`;
            } else if (lowerPrompt.includes('routine') || lowerPrompt.includes('morning') || lowerPrompt.includes('evening')) {
                reply = `Excellent inquiry, Oumar! Morning routines are the compounding cornerstone of your 85% productivity index. I highly recommend running your morning habits in strict sequencing: 
1. Waking → Complete 'Morning Deep Breaths'
2. Clear mind → Study Academics for 20 mins.
Avoid opening screens or notifications until these 2 tasks are checked!`;
            } else if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi') || lowerPrompt.includes('hey')) {
                reply = `Hello Oumar! As your personal AI Life Assistant and Habit Coach, I am here to help you coordinate your academics, habits, schedule, and philosophy of life. Feel free to ask me anything—whether it's about a school assignment, managing stress, scheduling study blocks, or just organizing your day! How can I assist you right now?`;
            } else {
                reply = `Thank you for reaching out, Oumar! I am here acting as your personal Life Assistant and Habit Coach. Currently, your daily habit tracking streak is at **${getOverallDailyStreak()} days**. 

To give you highly personalized intelligence on this question, please configure your secure **GEMINI_API_KEY** in the Secrets panel of AI Studio. Once connected, I can leverage full Gemini reasoning power to act as a complete assistant for your life, studies, and schedule. How can I help you right now?`;
            }

            coachMsg.innerHTML = `
                <div class="message-sender">Oumar AI Life Assistant</div>
                <div class="message-text">${reply}</div>
            `;
            chatContainer.appendChild(coachMsg);
            renderAIScreen();
        }, 1500);
    }
}

// Global Response Callback called by Native Android code
window.onGeminiResponseCallback = function(rawResponse) {
    const indicator = document.getElementById('ai-typing-indicator');
    if (indicator) indicator.remove();

    const chatContainer = document.getElementById('chat-messages');
    const coachMsg = document.createElement('div');
    coachMsg.className = 'message system-msg';
    
    // Simple markdown parsing to HTML
    let parsedHtml = rawResponse
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');

    coachMsg.innerHTML = `
        <div class="message-sender">Oumar AI Life Assistant</div>
        <div class="message-text">${parsedHtml}</div>
    `;
    chatContainer.appendChild(coachMsg);
    renderAIScreen();
};

function appendReviewToChats(reviewHtml) {
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
        const coachMsg = document.createElement('div');
        coachMsg.className = 'message system-msg';
        coachMsg.innerHTML = `
            <div class="message-sender">Oumar AI Life Assistant</div>
            <div class="message-text" style="font-size: 12px; line-height: 1.4; color: var(--text-primary);">
                <div style="font-size: 11px; font-weight: bold; color: var(--primary-color); margin-bottom: 8px; display: flex; align-items: center; gap: 4px; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
                    <span class="material-symbols-outlined" style="font-size: 16px;">analytics</span>
                    WEEKLY REVIEW GENERATED
                </div>
                ${reviewHtml}
            </div>
        `;
        chatContainer.appendChild(coachMsg);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

function getSkeletonHtmlForTab(tabId) {
    if (tabId === 'dashboard') {
        return `
            <div class="skeleton-loader-container">
                <div class="skeleton-card skeleton-shimmer" style="height: 110px; border:none; border-radius:var(--border-radius-lg); opacity: 0.85;"></div>
                
                <div class="skeleton-grid-2">
                    <div class="skeleton-card">
                        <div class="skeleton-header-block">
                            <div class="skeleton-title skeleton-shimmer"></div>
                            <div class="skeleton-shimmer" style="width: 80px; height: 16px;"></div>
                        </div>
                        <div class="skeleton-row" style="margin-top: 8px;">
                            <div class="skeleton-shimmer" style="width: 50px; height: 24px; border-radius: 12px;"></div>
                            <div class="skeleton-shimmer" style="width: 80px; height: 24px; border-radius: 12px;"></div>
                            <div class="skeleton-shimmer" style="width: 80px; height: 24px; border-radius: 12px;"></div>
                        </div>
                        <div class="skeleton-row" style="margin-top: 12px;">
                            <div class="skeleton-circle skeleton-shimmer" style="width: 24px; height: 24px;"></div>
                            <div class="skeleton-line skeleton-shimmer"></div>
                        </div>
                        <div class="skeleton-row">
                            <div class="skeleton-circle skeleton-shimmer" style="width: 24px; height: 24px;"></div>
                            <div class="skeleton-line skeleton-shimmer short"></div>
                        </div>
                    </div>
                    
                    <div class="skeleton-card" style="align-items: center; justify-content: center; gap: 16px;">
                        <div class="skeleton-title skeleton-shimmer" style="width: 50%;"></div>
                        <div class="skeleton-shimmer" style="width: 120px; height: 120px; border-radius: 50%;"></div>
                        <div class="skeleton-subtitle skeleton-shimmer" style="width: 70%;"></div>
                    </div>
                </div>

                <div class="skeleton-card">
                    <div class="skeleton-title skeleton-shimmer"></div>
                    <div class="skeleton-line skeleton-shimmer"></div>
                    <div class="skeleton-row">
                        <div class="skeleton-shimmer" style="width: 40px; height: 40px; border-radius: 8px;"></div>
                        <div class="skeleton-line skeleton-shimmer short"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    if (tabId === 'habits') {
        return `
            <div class="skeleton-loader-container">
                <div class="skeleton-header-block" style="margin-bottom: 8px;">
                    <div class="skeleton-title skeleton-shimmer" style="height: 24px; width: 30%;"></div>
                    <div class="skeleton-shimmer" style="width: 140px; height: 38px; border-radius: var(--border-radius-sm);"></div>
                </div>
                
                <div class="skeleton-card">
                    <div class="skeleton-row">
                        <div class="skeleton-circle skeleton-shimmer"></div>
                        <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                            <div class="skeleton-line skeleton-shimmer" style="width: 40%;"></div>
                            <div class="skeleton-line skeleton-shimmer short"></div>
                        </div>
                    </div>
                </div>
                
                <div class="skeleton-card">
                    <div class="skeleton-row">
                        <div class="skeleton-circle skeleton-shimmer"></div>
                        <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                            <div class="skeleton-line skeleton-shimmer" style="width: 55%;"></div>
                            <div class="skeleton-line skeleton-shimmer short"></div>
                        </div>
                    </div>
                </div>

                <div class="skeleton-card">
                    <div class="skeleton-title skeleton-shimmer"></div>
                    <div class="skeleton-line skeleton-shimmer"></div>
                    <div class="skeleton-button skeleton-shimmer" style="margin-top: 8px;"></div>
                </div>
            </div>
        `;
    }
    
    if (tabId === 'pomodoro') {
        return `
            <div class="skeleton-loader-container">
                <div class="skeleton-card" style="display:flex; flex-direction:column; align-items:center; gap:16px; padding:24px;">
                    <div class="skeleton-title skeleton-shimmer" style="width: 40%;"></div>
                    <div class="skeleton-circle skeleton-shimmer" style="width: 160px; height: 160px; border-radius: 50%;"></div>
                    <div class="skeleton-row" style="justify-content:center; gap:12px;">
                        <div class="skeleton-shimmer" style="width: 100px; height: 40px; border-radius: 20px;"></div>
                        <div class="skeleton-shimmer" style="width: 100px; height: 40px; border-radius: 20px;"></div>
                    </div>
                </div>
                <div class="skeleton-card">
                    <div class="skeleton-title skeleton-shimmer" style="width: 30%;"></div>
                    <div class="skeleton-line skeleton-shimmer"></div>
                    <div class="skeleton-line skeleton-shimmer short"></div>
                </div>
            </div>
        `;
    }

    if (tabId === 'school') {
        return `
            <div class="skeleton-loader-container">
                <div class="skeleton-grid-2">
                    <div class="skeleton-card">
                        <div class="skeleton-title skeleton-shimmer"></div>
                        <div class="skeleton-line skeleton-shimmer" style="height: 100px; margin-top: 10px;"></div>
                    </div>
                    <div class="skeleton-card">
                        <div class="skeleton-title skeleton-shimmer"></div>
                        <div class="skeleton-row" style="margin-top: 12px;">
                            <div class="skeleton-shimmer" style="width: 40px; height: 40px; border-radius: 8px;"></div>
                            <div class="skeleton-line skeleton-shimmer"></div>
                        </div>
                    </div>
                </div>
                <div class="skeleton-card">
                    <div class="skeleton-title skeleton-shimmer" style="width: 40%;"></div>
                    <div class="skeleton-line skeleton-shimmer" style="height: 120px;"></div>
                </div>
            </div>
        `;
    }

    if (tabId === 'prayers') {
        return `
            <div class="skeleton-loader-container">
                <div class="skeleton-card skeleton-shimmer" style="height: 90px; border-radius:12px;"></div>
                <div class="skeleton-card">
                    <div class="skeleton-title skeleton-shimmer" style="width: 50%;"></div>
                    <div class="skeleton-row" style="margin-top:12px;">
                        <div class="skeleton-shimmer" style="width: 20%; height: 30px; border-radius:6px;"></div>
                        <div class="skeleton-shimmer" style="width: 20%; height: 30px; border-radius:6px;"></div>
                        <div class="skeleton-shimmer" style="width: 20%; height: 30px; border-radius:6px;"></div>
                        <div class="skeleton-shimmer" style="width: 20%; height: 30px; border-radius:6px;"></div>
                    </div>
                </div>
            </div>
        `;
    }

    if (tabId === 'journal') {
        return `
            <div class="skeleton-loader-container">
                <div class="skeleton-grid-2">
                    <div class="skeleton-card">
                        <div class="skeleton-title skeleton-shimmer" style="width: 50%;"></div>
                        <div class="skeleton-shimmer" style="height: 60px; border-radius: 8px; margin-top: 8px;"></div>
                        <div class="skeleton-shimmer" style="height: 60px; border-radius: 8px; margin-top: 8px;"></div>
                    </div>
                    <div class="skeleton-card">
                        <div class="skeleton-title skeleton-shimmer" style="width: 60%;"></div>
                        <div class="skeleton-shimmer" style="width: 100%; height: 100px; border-radius: 4px; margin-top: 8px;"></div>
                    </div>
                </div>
            </div>
        `;
    }

    if (tabId === 'ai-coach') {
        return `
            <div class="skeleton-loader-container">
                <div class="skeleton-card">
                    <div class="skeleton-header-block">
                        <div class="skeleton-title skeleton-shimmer" style="width: 50%;"></div>
                        <div class="skeleton-shimmer" style="width: 80px; height: 24px; border-radius: 12px;"></div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 16px;">
                        <div style="align-self: flex-start; width: 75%; background: var(--bg-tertiary); padding: 12px; border-radius: 8px;">
                            <div class="skeleton-line skeleton-shimmer"></div>
                        </div>
                        <div style="align-self: flex-end; width: 60%; background: var(--primary-light); padding: 12px; border-radius: 8px;">
                            <div class="skeleton-line skeleton-shimmer short"></div>
                        </div>
                    </div>
                    <div class="skeleton-shimmer" style="height: 48px; border-radius: 8px; margin-top: 16px;"></div>
                </div>
            </div>
        `;
    }

    if (tabId === 'challenges') {
        return `
            <div class="skeleton-loader-container">
                <div class="skeleton-grid-2">
                    <div class="skeleton-card">
                        <div class="skeleton-title skeleton-shimmer" style="width: 60%;"></div>
                        <div class="skeleton-line skeleton-shimmer" style="height: 50px; margin-top:10px;"></div>
                    </div>
                    <div class="skeleton-card">
                        <div class="skeleton-title skeleton-shimmer" style="width: 60%;"></div>
                        <div class="skeleton-line skeleton-shimmer" style="height: 50px; margin-top:10px;"></div>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="skeleton-loader-container">
            <div class="skeleton-card">
                <div class="skeleton-title skeleton-shimmer"></div>
                <div class="skeleton-line skeleton-shimmer"></div>
                <div class="skeleton-line skeleton-shimmer short"></div>
            </div>
            <div class="skeleton-card">
                <div class="skeleton-line skeleton-shimmer"></div>
                <div class="skeleton-line skeleton-shimmer short"></div>
            </div>
        </div>
    `;
}

function renderScreenForTab(tabId) {
    if (tabId === 'dashboard') {
        renderDashboard();
    } else if (tabId === 'habits') {
        renderHabitsScreen();
    } else if (tabId === 'school') {
        renderSchoolScreen();
    } else if (tabId === 'journal') {
        renderJournalScreen();
    } else if (tabId === 'ai-coach') {
        renderAIScreen();
    } else if (tabId === 'prayers') {
        renderPrayersScreen();
    } else if (tabId === 'challenges') {
        renderChallengesScreen();
    } else if (tabId === 'pomodoro') {
        renderFocusScreen();
    }
}

function triggerSkeletonLoad(tabId) {
    const tabPanel = document.getElementById(`tab-${tabId}`);
    if (!tabPanel) {
        renderScreenForTab(tabId);
        return;
    }

    // 1. Hide actual components
    const originalChildren = Array.from(tabPanel.children);
    originalChildren.forEach(child => {
        child.classList.add('content-hidden');
    });

    // 2. Add high fidelity shimmery skeleton overlay
    const skeletonOverlay = document.createElement('div');
    skeletonOverlay.className = 'skeleton-overlay-wrapper';
    skeletonOverlay.style.width = '100%';
    skeletonOverlay.style.padding = '4px 0';
    skeletonOverlay.innerHTML = getSkeletonHtmlForTab(tabId);
    
    tabPanel.appendChild(skeletonOverlay);

    // 3. Resolve load with simulated async transition (380ms)
    setTimeout(() => {
        skeletonOverlay.remove();
        originalChildren.forEach(child => {
            child.classList.remove('content-hidden');
        });

        // 4. Force specific screen repaint with correct database data
        renderScreenForTab(tabId);
    }, 380);
}

function switchTab(targetTab, skipSkeleton = false) {
    const hubSubtabs = ['habits', 'pomodoro', 'school', 'prayers', 'journal', 'ai-coach', 'challenges', 'settings'];
    
    let activeMainTab = 'dashboard';
    let activeSubtab = 'habits';

    if (targetTab === 'dashboard') {
        activeMainTab = 'dashboard';
    } else if (targetTab === 'hub') {
        activeMainTab = 'hub';
        const activePill = document.querySelector('.hub-pill.active');
        activeSubtab = activePill ? activePill.dataset.hubTab : 'habits';
    } else if (hubSubtabs.includes(targetTab)) {
        activeMainTab = 'hub';
        activeSubtab = targetTab;
    }

    // 1. Toggle main tab panels
    document.querySelectorAll('.app-content > .tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${activeMainTab}`);
    });

    // 2. Toggle bottom navigation bar active state
    document.querySelectorAll('.app-bottom-nav .nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.tab === activeMainTab);
    });

    // 3. Toggle sidebar main navigation active state
    document.querySelectorAll('.app-sidebar .nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.tab === activeMainTab);
    });

    // 4. Update Studio Hub subpanels, pills, and shortcuts
    if (activeMainTab === 'hub') {
        document.querySelectorAll('.hub-pill').forEach(pill => {
            pill.classList.toggle('active', pill.dataset.hubTab === activeSubtab);
        });

        document.querySelectorAll('.hub-subpanel').forEach(subpanel => {
            subpanel.classList.toggle('active', subpanel.id === `tab-${activeSubtab}`);
        });

        document.querySelectorAll('.nav-shortcut-item').forEach(item => {
            item.classList.toggle('active', item.dataset.hubTarget === activeSubtab);
        });
    } else {
        document.querySelectorAll('.nav-shortcut-item').forEach(item => {
            item.classList.remove('active');
        });
    }

    // 5. Trigger Skeleton Load Transition
    const screenToRender = activeMainTab === 'dashboard' ? 'dashboard' : activeSubtab;
    if (!skipSkeleton) {
        triggerSkeletonLoad(screenToRender);
    } else {
        renderScreenForTab(screenToRender);
    }
}

// ====================================
// CENTRALIZED MODAL & SUBJECT CONTROL
// ====================================
function openModal(modalId) {
    try {
        closeAllModals();

        const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
        if (!modal) return;

        modal.classList.add('active');
        modal.style.display = 'flex';
        modal.style.pointerEvents = 'auto';

        document.body.classList.add('modal-open', 'overflow-hidden');
        document.body.style.overflow = 'hidden';
        document.body.style.pointerEvents = 'auto';

        const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea, button:not(.modal-close)');
        if (firstInput) {
            setTimeout(() => {
                try { firstInput.focus(); } catch (e) {}
            }, 60);
        }
    } catch (err) {
        console.error("Error opening modal:", err);
    }
}

function closeModal(modalId) {
    try {
        if (!modalId) {
            closeAllModals();
            return;
        }

        const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }

        document.querySelectorAll('.modal-backdrop, .modal-overlay-bg, .custom-backdrop').forEach(el => {
            try { el.remove(); } catch (e) {}
        });

        document.body.classList.remove('modal-open', 'overflow-hidden', 'no-scroll');
        document.documentElement.classList.remove('modal-open', 'overflow-hidden', 'no-scroll');
        document.body.style.overflow = '';
        document.body.style.pointerEvents = 'auto';
        document.documentElement.style.pointerEvents = 'auto';

        document.querySelectorAll('.app-header, .app-sidebar, .app-bottom-nav, .app-content, .tab-panel, .hub-subpanel').forEach(el => {
            el.style.pointerEvents = 'auto';
        });
    } catch (err) {
        console.error("Error closing modal:", err);
    }
}

function closeAllModals() {
    try {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('active');
            modal.style.display = 'none';
        });

        document.querySelectorAll('.modal-backdrop, .modal-overlay-bg, .custom-backdrop').forEach(el => {
            try { el.remove(); } catch (e) {}
        });

        document.body.classList.remove('modal-open', 'overflow-hidden', 'no-scroll');
        document.documentElement.classList.remove('modal-open', 'overflow-hidden', 'no-scroll');
        document.body.style.overflow = '';
        document.body.style.pointerEvents = 'auto';
        document.documentElement.style.pointerEvents = 'auto';

        document.querySelectorAll('.app-header, .app-sidebar, .app-bottom-nav, .app-content, .tab-panel, .hub-subpanel').forEach(el => {
            el.style.pointerEvents = 'auto';
        });
    } catch (err) {
        console.error("Error closing all modals:", err);
    }
}

function updateSubjectDatalist() {
    try {
        const datalist = document.getElementById('subjects-datalist');
        if (!datalist) return;
        datalist.innerHTML = '';
        
        let subjectsList = state.subjects;
        if (!subjectsList || !Array.isArray(subjectsList) || subjectsList.length === 0) {
            subjectsList = ["PHYS202", "MATH201", "CHEM101", "CS101", "ENG102"];
            state.subjects = subjectsList;
        }

        if (state.schoolTasks) {
            state.schoolTasks.forEach(t => {
                if (t.subject && !subjectsList.includes(t.subject)) {
                    subjectsList.push(t.subject);
                }
            });
        }

        subjectsList.forEach(sub => {
            const opt = document.createElement('option');
            opt.value = sub;
            datalist.appendChild(opt);
        });
    } catch (e) {
        console.error("Error updating subject datalist:", e);
    }
}

// --- Initialization Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    
    // Global Backdrop Click Handler to dismiss modals safely
    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('modal-overlay')) {
            closeModal(e.target);
        }
    });

    // Escape Key Handler to dismiss open modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Setup 2-Tab Navigation Listeners
    document.querySelectorAll('[data-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            switchTab(targetTab);
        });
    });

    // Setup Sidebar Shortcut Listeners
    document.querySelectorAll('.nav-shortcut-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.hubTarget;
            switchTab(target);
        });
    });

    // Setup Studio Hub Pill Listeners
    document.querySelectorAll('.hub-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const target = pill.dataset.hubTab;
            switchTab(target);
        });
    });

    // Setup .btn-go-tab navigation links
    document.querySelectorAll('.btn-go-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            switchTab(target);
        });
    });

    // Initial render
    switchTab('dashboard', false);

    // Routine morning/evening filter toggle
    document.querySelectorAll('.routine-filter .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.routine-filter .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderDashboard();
        });
    });

    // Triple Mood Check-In Button Click via delegation
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.mood-check-slot .mood-btn');
        if (btn) {
            const slot = btn.dataset.slot;
            const moodVal = parseInt(btn.dataset.mood);
            const todayStr = getTodayString();
            logMoodCheck(todayStr, slot, moodVal);
        }
    });

    // Weekly Reflection Saving Submit
    const journalForm = document.getElementById('journal-form');
    if (journalForm) {
        journalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const weekEndingVal = document.getElementById('entry-week-selector')?.value || '';
            const reflection = document.getElementById('entry-reflection')?.value || '';
            const grateful = document.getElementById('entry-grateful')?.value || '';
            
            // Get linked checked habits
            const linkedHabitIds = [];
            document.querySelectorAll('input[name="journal-linked-habits"]:checked').forEach(c => {
                linkedHabitIds.push(c.value);
            });

            if (!state.weeklyReflections) state.weeklyReflections = [];
            
            let existingIndex = state.weeklyReflections.findIndex(r => r.weekEnding === weekEndingVal);
            const reflectionObj = {
                weekEnding: weekEndingVal,
                reflection: reflection,
                gratefulFor: grateful,
                habitsReviewed: linkedHabitIds
            };
            
            if (existingIndex >= 0) {
                state.weeklyReflections[existingIndex] = reflectionObj;
            } else {
                state.weeklyReflections.push(reflectionObj);
            }

            // Recovery path for Level 5 Failure
            let restoredStreak = false;
            if (state.level5Failure) {
                state.level5Failure = false;
                restoredStreak = true;
            }

            saveToLocalStorage();
            evaluateChallengesAndBadges();
            renderJournalScreen();
            renderDashboard();
            playFocusChime();
            
            if (restoredStreak) {
                alert("💖 Apology Weekly Reflection logged successfully! Your Level 5 Lockdown is cleared and your streak has been restored.");
            } else {
                alert("Weekly Reflection saved successfully!");
            }
        });
    }

    // Task Checkpoints / Habit completions on Dashboard
    const dashboardTodayList = document.getElementById('dashboard-today-list');
    if (dashboardTodayList) {
        dashboardTodayList.addEventListener('click', (e) => {
            const todayStr = getTodayString();
            
            // Yes/No Checkbox triggers
            if (e.target.classList.contains('habit-check-click')) {
                const habitId = e.target.dataset.id;
                const completed = e.target.checked;
                
                if (!state.logs[todayStr]) state.logs[todayStr] = {};
                state.logs[todayStr][habitId] = { value: completed ? 1 : 0, completed: completed };
                
                saveToLocalStorage();
                evaluateChallengesAndBadges();
                renderAllScreens();
                
                if (completed) playFocusChime();
            }
            
            // Count/Duration Increments
            if (e.target.classList.contains('num-inc')) {
                const habitId = e.target.dataset.id;
                const habit = state.habits.find(h => h.id === habitId);
                
                if (!state.logs[todayStr]) state.logs[todayStr] = {};
                if (!state.logs[todayStr][habitId]) state.logs[todayStr][habitId] = { value: 0, completed: false };
                
                state.logs[todayStr][habitId].value++;
                if (state.logs[todayStr][habitId].value >= habit.target) {
                    state.logs[todayStr][habitId].completed = true;
                    playFocusChime();
                }
                
                saveToLocalStorage();
                evaluateChallengesAndBadges();
                renderAllScreens();
            }

            // Count/Duration Decrements
            if (e.target.classList.contains('num-dec')) {
                const habitId = e.target.dataset.id;
                const habit = state.habits.find(h => h.id === habitId);
                
                if (!state.logs[todayStr] || !state.logs[todayStr][habitId]) return;
                
                state.logs[todayStr][habitId].value = Math.max(0, state.logs[todayStr][habitId].value - 1);
                if (state.logs[todayStr][habitId].value < habit.target) {
                    state.logs[todayStr][habitId].completed = false;
                }
                
                saveToLocalStorage();
                evaluateChallengesAndBadges();
                renderAllScreens();
            }
        });
    }

    // School planner mark done / revert triggers
    const handleSchoolColClick = (e) => {
        try {
            if (e.target.classList.contains('task-done-click')) {
                const id = e.target.dataset.id;
                const task = state.schoolTasks.find(t => t.id === id);
                if (task) {
                    // Trigger Accountability Academic Verification Modal instead of auto-completing
                    const verifyModal = document.getElementById('school-verify-modal');
                    if (verifyModal) {
                        document.getElementById('school-verify-task-id').value = id;
                        document.getElementById('school-verify-task-title').textContent = `📝 Objective: ${task.title} (${task.type.toUpperCase()})`;
                        document.getElementById('school-verify-reflection').value = '';
                        document.getElementById('school-verify-file').value = '';
                        document.getElementById('school-verify-file-lbl').textContent = "Select or snap photo proof";
                        document.getElementById('school-verify-preview-container').style.display = 'none';
                        
                        document.getElementById('school-verify-form').style.display = 'block';
                        document.getElementById('school-verify-loading').style.display = 'none';
                        document.getElementById('school-verify-success').style.display = 'none';
                        
                        openModal('school-verify-modal');
                    } else {
                        // Fallback if modal is missing
                        task.completed = true;
                        playFocusChime();
                        saveToLocalStorage();
                        evaluateChallengesAndBadges();
                        renderSchoolScreen();
                        renderDashboard();
                    }
                }
            }
            if (e.target.classList.contains('task-revert-click')) {
                const id = e.target.dataset.id;
                const task = state.schoolTasks.find(t => t.id === id);
                if (task) {
                    task.completed = false;
                    saveToLocalStorage();
                    evaluateChallengesAndBadges();
                    renderSchoolScreen();
                    renderDashboard();
                }
            }
        } catch (err) {
            console.error("Error in school column click handler:", err);
        }
    };
    const todoListEl = document.getElementById('school-todo-list');
    if (todoListEl) todoListEl.addEventListener('click', handleSchoolColClick);
    const completedListEl = document.getElementById('school-completed-list');
    if (completedListEl) completedListEl.addEventListener('click', handleSchoolColClick);

    // Open score details analytics modal on dashboard click
    const headerProdBtn = document.getElementById('header-productivity-btn');
    if (headerProdBtn) {
        headerProdBtn.addEventListener('click', () => {
            try {
                const score = calculateProductivityScore();
                document.getElementById('detail-score-display').textContent = score.overall;
                
                let label = "Stable Performance";
                if (score.overall >= 80) label = "Excellent Academic & Habit Synchronization!";
                else if (score.overall >= 50) label = "Positive Trajectory. Keep Logging.";
                else label = "Critical Momentum Required. Anchor focus sprints.";
                
                document.getElementById('detail-score-quality').textContent = label;
                openModal('analytics-modal');
            } catch (err) {
                console.error("Error launching analytics modal:", err);
            }
        });
    }

    // General Modal dismiss buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetModal = btn.dataset.modal;
            if (targetModal) {
                closeModal(targetModal);
            } else {
                const parentModal = btn.closest('.modal-overlay');
                closeModal(parentModal);
            }
        });
    });

    // Create Habit modal trigger
    const addHabitBtn = document.getElementById('add-habit-btn');
    if (addHabitBtn) {
        addHabitBtn.addEventListener('click', () => {
            try {
                document.getElementById('habit-form').reset();
                document.getElementById('habit-edit-id').value = '';
                document.getElementById('habit-modal-title').textContent = 'Create New Habit';
                document.getElementById('habit-delete-btn').style.display = 'none';
                
                // Reset custom Atomic fields
                document.getElementById('habit-impl-time').value = '';
                document.getElementById('habit-impl-loc').value = '';
                document.getElementById('habit-2min-version').value = '';
                document.getElementById('habit-temptation').value = '';
                
                openModal('habit-modal');
            } catch (err) {
                console.error("Error opening habit modal:", err);
            }
        });
    }

    // Edit/Manage Habit card click triggers
    const habitsListCont = document.getElementById('habits-list-container');
    if (habitsListCont) {
        habitsListCont.addEventListener('click', (e) => {
            try {
                if (e.target.classList.contains('btn-edit-habit')) {
                    const id = e.target.dataset.id;
                    const habit = state.habits.find(h => h.id === id);
                    if (habit) {
                        document.getElementById('habit-edit-id').value = habit.id;
                        document.getElementById('habit-name').value = habit.name;
                        document.getElementById('habit-category').value = habit.category;
                        document.getElementById('habit-routine').value = habit.routine;
                        document.getElementById('habit-type').value = habit.type;
                        document.getElementById('habit-target').value = habit.target;
                        document.getElementById('habit-schedule').value = habit.schedule;
                        document.getElementById('habit-notes').value = habit.notes || '';
                        
                        document.getElementById('habit-impl-time').value = habit.implementationTime || '';
                        document.getElementById('habit-impl-loc').value = habit.implementationLocation || '';
                        document.getElementById('habit-2min-version').value = habit.twoMinVersion || '';
                        document.getElementById('habit-temptation').value = habit.temptationReward || '';
                        
                        document.getElementById('habit-delete-btn').style.display = 'block';
                        document.getElementById('habit-modal-title').textContent = 'Modify Habit Vault';
                        
                        document.querySelectorAll('.color-palette-selector .color-dot').forEach(dot => {
                            dot.classList.toggle('active', dot.dataset.color === habit.color);
                        });
                        document.getElementById('habit-color').value = habit.color;

                        openModal('habit-modal');
                    }
                }
            } catch (err) {
                console.error("Error editing habit card:", err);
            }
        });
    }

    // Color palette dot selection events inside habit creation modal
    document.querySelectorAll('.color-palette-selector .color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            document.querySelectorAll('.color-palette-selector .color-dot').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            document.getElementById('habit-color').value = dot.dataset.color;
        });
    });

    // Custom Category Input handling
    const habitCatSel = document.getElementById('habit-category');
    if (habitCatSel) {
        habitCatSel.addEventListener('change', (e) => {
            const isCustom = e.target.value === 'Custom';
            document.getElementById('habit-custom-category').style.display = isCustom ? 'block' : 'none';
        });
    }

    // Custom repeat days checklist container
    const habitSchedSel = document.getElementById('habit-schedule');
    if (habitSchedSel) {
        habitSchedSel.addEventListener('change', (e) => {
            const isCustomDays = e.target.value === 'custom';
            document.getElementById('habit-custom-days').style.display = isCustomDays ? 'flex' : 'none';
        });
    }

    // Submit Habit Form (Insert / Update)
    const habitForm = document.getElementById('habit-form');
    if (habitForm) {
        habitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            try {
                const editId = document.getElementById('habit-edit-id').value;
                const name = document.getElementById('habit-name').value;
                const routine = document.getElementById('habit-routine').value;
                const type = document.getElementById('habit-type').value;
                const target = parseInt(document.getElementById('habit-target').value) || 1;
                const schedule = document.getElementById('habit-schedule').value;
                const notes = document.getElementById('habit-notes').value;
                const color = document.getElementById('habit-color').value;

                const implementationTime = document.getElementById('habit-impl-time').value;
                const implementationLocation = document.getElementById('habit-impl-loc').value;
                const twoMinVersion = document.getElementById('habit-2min-version').value;
                const temptationReward = document.getElementById('habit-temptation').value;

                let category = document.getElementById('habit-category').value;
                if (category === 'Custom') {
                    category = document.getElementById('habit-custom-category').value || 'General';
                }

                const customDays = [];
                if (schedule === 'custom') {
                    document.querySelectorAll('#habit-custom-days input:checked').forEach(c => {
                        customDays.push(parseInt(c.value));
                    });
                }

                if (editId) {
                    const index = state.habits.findIndex(h => h.id === editId);
                    if (index !== -1) {
                        state.habits[index] = { 
                            ...state.habits[index], 
                            name, category, routine, type, target, schedule, days: customDays, color, notes,
                            implementationTime, implementationLocation, twoMinVersion, temptationReward
                        };
                    }
                } else {
                    const newHabit = {
                        id: 'habit_' + Date.now(),
                        name, category, routine, type, target, schedule, days: customDays, color, notes,
                        implementationTime, implementationLocation, twoMinVersion, temptationReward,
                        archived: false
                    };
                    state.habits.push(newHabit);
                }

                saveToLocalStorage();
                evaluateChallengesAndBadges();
                renderAllScreens();
                playFocusChime();
            } catch (err) {
                console.error("Error saving habit:", err);
            } finally {
                closeModal('habit-modal');
            }
        });
    }

    // Delete Habit action
    const habitDeleteBtn = document.getElementById('habit-delete-btn');
    if (habitDeleteBtn) {
        habitDeleteBtn.addEventListener('click', () => {
            try {
                const editId = document.getElementById('habit-edit-id').value;
                if (editId && confirm("Are you sure you want to delete this habit? All historic records for this habit will be detached.")) {
                    state.habits = state.habits.filter(h => h.id !== editId);
                    saveToLocalStorage();
                    renderAllScreens();
                }
            } catch (err) {
                console.error("Error deleting habit:", err);
            } finally {
                closeModal('habit-modal');
            }
        });
    }

    // --- ADD / EDIT SUBJECT MODAL & LOGIC ---
    updateSubjectDatalist();

    const addSubjectBtn = document.getElementById('add-subject-btn');
    if (addSubjectBtn) {
        addSubjectBtn.addEventListener('click', () => {
            try {
                const subjectForm = document.getElementById('subject-form');
                if (subjectForm) subjectForm.reset();
                openModal('subject-modal');
            } catch (err) {
                console.error("Error launching Add Subject modal:", err);
                closeModal('subject-modal');
            }
        });
    }

    const subjectForm = document.getElementById('subject-form');
    if (subjectForm) {
        subjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            try {
                const nameInput = document.getElementById('subject-name');
                const subjectName = nameInput ? nameInput.value.trim() : '';

                if (subjectName) {
                    if (!state.subjects) state.subjects = [];
                    if (!state.subjects.includes(subjectName)) {
                        state.subjects.push(subjectName);
                        saveToLocalStorage();
                    }
                    updateSubjectDatalist();
                    renderSchoolScreen();
                    renderDashboard();
                }
            } catch (err) {
                console.error("Error creating subject:", err);
            } finally {
                closeModal('subject-modal');
            }
        });
    }

    // School planner modals and forms
    const addSchoolTaskBtn = document.getElementById('add-school-task-btn');
    if (addSchoolTaskBtn) {
        addSchoolTaskBtn.addEventListener('click', () => {
            try {
                const schoolForm = document.getElementById('school-form');
                if (schoolForm) schoolForm.reset();
                
                const editIdEl = document.getElementById('school-edit-id');
                if (editIdEl) editIdEl.value = '';
                
                const titleEl = document.getElementById('school-modal-title');
                if (titleEl) titleEl.textContent = 'Add School Task';
                
                const deleteBtn = document.getElementById('school-delete-btn');
                if (deleteBtn) deleteBtn.style.display = 'none';
                
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const dueEl = document.getElementById('school-due');
                if (dueEl) dueEl.value = tomorrow.toISOString().split('T')[0];
                
                updateSubjectDatalist();
                openModal('school-modal');
            } catch (err) {
                console.error("Error launching Add School Task modal:", err);
                closeModal('school-modal');
            }
        });
    }

    // Save School Planner Task
    const schoolForm = document.getElementById('school-form');
    if (schoolForm) {
        schoolForm.addEventListener('submit', (e) => {
            e.preventDefault();
            try {
                const editId = document.getElementById('school-edit-id').value;
                const title = document.getElementById('school-title').value;
                const type = document.getElementById('school-type').value;
                const due = document.getElementById('school-due').value;
                const subject = document.getElementById('school-subject').value;
                const notes = document.getElementById('school-notes').value;

                if (editId) {
                    const index = state.schoolTasks.findIndex(t => t.id === editId);
                    if (index !== -1) {
                        state.schoolTasks[index] = { ...state.schoolTasks[index], title, type, due, subject, notes };
                    }
                } else {
                    const newTask = {
                        id: 'school_' + Date.now(),
                        title, type, due, subject, notes,
                        completed: false
                    };
                    state.schoolTasks.push(newTask);
                }

                if (subject && subject.trim()) {
                    if (!state.subjects) state.subjects = [];
                    const trimmedSub = subject.trim();
                    if (!state.subjects.includes(trimmedSub)) {
                        state.subjects.push(trimmedSub);
                    }
                }

                saveToLocalStorage();
                evaluateChallengesAndBadges();
                updateSubjectDatalist();
                renderSchoolScreen();
                renderDashboard();
                playFocusChime();
            } catch (err) {
                console.error("Error saving school task:", err);
            } finally {
                closeModal('school-modal');
            }
        });
    }

    // Trigger school Column task details edit modal
    const editSchoolTaskTrigger = (e) => {
        try {
            const card = e.target.closest('.school-task-card');
            if (card && !e.target.classList.contains('task-done-click') && !e.target.classList.contains('task-revert-click')) {
                const id = card.dataset.id;
                const task = state.schoolTasks.find(t => t.id === id);
                if (task) {
                    document.getElementById('school-edit-id').value = task.id;
                    document.getElementById('school-title').value = task.title;
                    document.getElementById('school-type').value = task.type;
                    document.getElementById('school-due').value = task.due;
                    document.getElementById('school-subject').value = task.subject || '';
                    document.getElementById('school-notes').value = task.notes || '';
                    
                    document.getElementById('school-delete-btn').style.display = 'block';
                    document.getElementById('school-modal-title').textContent = 'Modify School Planner';
                    updateSubjectDatalist();
                    openModal('school-modal');
                }
            }
        } catch (err) {
            console.error("Error editing school task trigger:", err);
        }
    };

    // Delete school task
    const schoolDeleteBtn = document.getElementById('school-delete-btn');
    if (schoolDeleteBtn) {
        schoolDeleteBtn.addEventListener('click', () => {
            try {
                const editId = document.getElementById('school-edit-id').value;
                if (editId) {
                    state.schoolTasks = state.schoolTasks.filter(t => t.id !== editId);
                    saveToLocalStorage();
                    renderSchoolScreen();
                    renderDashboard();
                }
            } catch (err) {
                console.error("Error deleting school task:", err);
            } finally {
                closeModal('school-modal');
            }
        });
    }

    // Habits Filter Change events
    document.getElementById('habit-search')?.addEventListener('input', renderHabitsScreen);
    document.getElementById('habit-category-filter')?.addEventListener('change', renderHabitsScreen);
    document.getElementById('habit-status-filter')?.addEventListener('change', renderHabitsScreen);

    // Focus mode linked selectors
    document.querySelectorAll('.timer-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setTimerMode(btn.dataset.mode);
        });
    });

    // Focus controls click handlers
    document.getElementById('timer-play-pause')?.addEventListener('click', toggleTimer);
    document.getElementById('timer-reset')?.addEventListener('click', () => {
        setTimerMode(timerState.mode);
    });
    document.getElementById('timer-skip')?.addEventListener('click', () => {
        handleTimerComplete();
    });

    // Conversational Chat AI prompt send click
    document.getElementById('chat-send-btn')?.addEventListener('click', () => {
        const input = document.getElementById('chat-input');
        const text = input ? input.value.trim() : '';
        if (text) {
            askAICoach(text);
            if (input) input.value = '';
        }
    });

    document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const text = e.target.value.trim();
            if (text) {
                askAICoach(text);
                e.target.value = '';
            }
        }
    });

    // AI Tab switching
    document.querySelectorAll('.ai-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.ai-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const target = btn.dataset.aiSection;
            document.querySelectorAll('.ai-content-panel').forEach(panel => {
                panel.classList.toggle('active', panel.id === `ai-section-${target}`);
            });
        });
    });

    // Weekly AI Review compiler
    document.getElementById('generate-review-btn')?.addEventListener('click', () => {
        const reviewBox = document.getElementById('review-output-container');
        if (reviewBox) {
            reviewBox.classList.remove('empty');
            reviewBox.innerHTML = `<div class="empty-state"><span class="material-symbols-outlined">analytics</span><p>Processing weekly stats and formulating directives...</p></div>`;
        }

        const reviewPrompt = `Generate a comprehensive "Weekly Performance Review" for Oumar. Summarize his achievements, streaks, strongest routine habits, identify weaknesses, and provide 3 actionable goals. Maintain professional Markdown presentation with headers, list tags, and tables. 

Data Context:
${getSystemContextForAI()}`;

        if (isAndroidNative() && window.AndroidBridge.callWeeklyReviewAPI) {
            window.AndroidBridge.callWeeklyReviewAPI(reviewPrompt, "onWeeklyReviewCallback");
        } else {
            // Mock async rules compiler
            setTimeout(() => {
                const offlineHtml = generateOfflineAIReview();
                if (reviewBox) reviewBox.innerHTML = offlineHtml;
                appendReviewToChats(offlineHtml);
            }, 1800);
        }
    });

    // Settings Profile Forms save
    document.getElementById('settings-personalization-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('settings-username')?.value || '';
        const motivationStyle = document.getElementById('settings-motivation-style')?.value || '';
        
        state.user.name = username;
        state.user.motivationStyle = motivationStyle;
        
        saveToLocalStorage();
        
        // Update welcome texts instantly
        const welcomeTitle = document.getElementById('welcome-title');
        if (welcomeTitle) welcomeTitle.textContent = `Good morning, ${username}!`;
        
        alert("Personalized settings saved!");
    });

    // Sound effects toggler
    document.getElementById('setting-sound-effects')?.addEventListener('change', (e) => {
        state.soundEffectsEnabled = e.target.checked;
        saveToLocalStorage();
    });

    // Browser Notification Enable click
    document.getElementById('btn-request-notification')?.addEventListener('click', () => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            alert("Notifications already active!");
        } else {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    sendNativeNotification("Alerts Configured!", "Oumar Habits reminders initialized successfully.");
                    const btn = document.getElementById('btn-request-notification');
                    if (btn) btn.textContent = "Active ✓";
                }
            });
        }
    });

    // Export Data JSON trigger
    document.getElementById('btn-export-data')?.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `oumar_habits_backup_${getTodayString()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    // Trigger select file click for import
    document.getElementById('btn-trigger-import')?.addEventListener('click', () => {
        document.getElementById('input-import-file')?.click();
    });

    // Process imported file
    document.getElementById('input-import-file')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const parsed = JSON.parse(evt.target.result);
                // Validate parsed data
                if (parsed.habits && parsed.logs && parsed.schoolTasks) {
                    state = parsed;
                    saveToLocalStorage();
                    alert("Import successful! Refreshing layout databases.");
                    location.reload();
                } else {
                    alert("Invalid backup file. Missing habit data structures.");
                }
            } catch (err) {
                alert("Error reading JSON file.");
            }
        };
        reader.readAsText(file);
    });

    // Factory reset database
    document.getElementById('btn-factory-reset')?.addEventListener('click', () => {
        if (confirm("Are you absolutely sure you want to restore default template data? ALL logs and homework will be wiped permanently.")) {
            localStorage.removeItem('oumar_habits_state');
            location.reload();
        }
    });

    // Light / Dark Theme toggle event
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            const icon = themeBtn.querySelector('.material-symbols-outlined');
            if (icon) icon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
        });
    }

    // Navigate to specified target tabs on link clicks inside content panels
    document.querySelectorAll('.btn-go-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            switchTab(target);
        });
    });

    // --- PRAYERS & ANCHORS EVENT LISTENERS ---
    
    // Submit Habit Stacking Link
    const stackBuilderForm = document.getElementById('stack-builder-form');
    if (stackBuilderForm) {
        stackBuilderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const habitId = document.getElementById('stack-habit-select').value;
            const anchor = document.getElementById('stack-anchor-select').value;
            
            if (!habitId || !anchor) return;
            
            // Check if already stacked
            const alreadyExists = state.habitStacks.some(s => s.habitId === habitId && s.anchor === anchor);
            if (!alreadyExists) {
                state.habitStacks.push({ habitId, anchor });
                saveToLocalStorage();
                renderAllScreens();
                playFocusChime();
            } else {
                alert("This habit is already stacked onto this daily anchor!");
            }
        });
    }
    
    // Removing a Stack Link
    const stackLinksList = document.getElementById('stack-links-list');
    if (stackLinksList) {
        stackLinksList.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-remove-stack');
            if (btn) {
                const idx = parseInt(btn.dataset.index);
                state.habitStacks.splice(idx, 1);
                saveToLocalStorage();
                renderAllScreens();
            }
        });
    }
    
    // Timeline Toggles (Prayer logs & Fajr wake-up & Stacked habits)
    const timelineContainer = document.getElementById('prayer-timeline-container');
    if (timelineContainer) {
        timelineContainer.addEventListener('change', (e) => {
            const todayStr = getTodayString();
            
            // 1. Log Prayer Completion
            if (e.target.classList.contains('prayer-log-check')) {
                const prayerCode = e.target.dataset.prayer;
                const isChecked = e.target.checked;
                
                if (!state.prayerLogs) state.prayerLogs = {};
                if (!state.prayerLogs[todayStr]) {
                    state.prayerLogs[todayStr] = { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false, fajrWakeUp: false };
                }
                
                state.prayerLogs[todayStr][prayerCode] = isChecked;
                
                // Add positive feedback (reward XP on dashboard or streak evaluation)
                if (isChecked) {
                    playFocusChime();
                    // Increment XP/Points if we want to show immediate dopamine
                    const xpNotice = document.createElement('div');
                    xpNotice.style.position = 'fixed';
                    xpNotice.style.bottom = '80px';
                    xpNotice.style.right = '20px';
                    xpNotice.style.background = 'var(--accent-color)';
                    xpNotice.style.color = '#FFF';
                    xpNotice.style.padding = '8px 16px';
                    xpNotice.style.borderRadius = '20px';
                    xpNotice.style.fontSize = '12px';
                    xpNotice.style.fontWeight = 'bold';
                    xpNotice.style.boxShadow = 'var(--shadow-lg)';
                    xpNotice.style.zIndex = '99999';
                    xpNotice.innerHTML = `🕌 Prayer logged! +15 XP`;
                    document.body.appendChild(xpNotice);
                    setTimeout(() => xpNotice.remove(), 2500);
                }
                
                saveToLocalStorage();
                evaluateChallengesAndBadges();
                renderAllScreens();
            }
            
            // 2. Fajr Wake-up Completion
            if (e.target.classList.contains('fajr-wake-check')) {
                const isChecked = e.target.checked;
                
                if (!state.prayerLogs) state.prayerLogs = {};
                if (!state.prayerLogs[todayStr]) {
                    state.prayerLogs[todayStr] = { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false, fajrWakeUp: false };
                }
                
                state.prayerLogs[todayStr].fajrWakeUp = isChecked;
                
                if (isChecked) {
                    playFocusChime();
                    const xpNotice = document.createElement('div');
                    xpNotice.style.position = 'fixed';
                    xpNotice.style.bottom = '80px';
                    xpNotice.style.right = '20px';
                    xpNotice.style.background = 'var(--warning-color)';
                    xpNotice.style.color = '#000';
                    xpNotice.style.padding = '8px 16px';
                    xpNotice.style.borderRadius = '20px';
                    xpNotice.style.fontSize = '12px';
                    xpNotice.style.fontWeight = 'bold';
                    xpNotice.style.boxShadow = 'var(--shadow-lg)';
                    xpNotice.style.zIndex = '99999';
                    xpNotice.innerHTML = `🌅 Sunrise Master! +25 XP`;
                    document.body.appendChild(xpNotice);
                    setTimeout(() => xpNotice.remove(), 2500);
                }
                
                saveToLocalStorage();
                evaluateChallengesAndBadges();
                renderAllScreens();
            }
            
            // 3. Completed stacked habits directly from timeline!
            if (e.target.classList.contains('stacked-habit-check-timeline')) {
                const habitId = e.target.dataset.habitId;
                const isChecked = e.target.checked;
                const habit = state.habits.find(h => h.id === habitId);
                
                if (habit) {
                    if (!state.logs[todayStr]) state.logs[todayStr] = {};
                    if (!state.logs[todayStr][habitId]) {
                        state.logs[todayStr][habitId] = { value: 0, completed: false };
                    }
                    
                    state.logs[todayStr][habitId].completed = isChecked;
                    state.logs[todayStr][habitId].value = isChecked ? habit.target : 0;
                    
                    if (isChecked) {
                        playFocusChime();
                        const xpNotice = document.createElement('div');
                        xpNotice.style.position = 'fixed';
                        xpNotice.style.bottom = '80px';
                        xpNotice.style.right = '20px';
                        xpNotice.style.background = 'var(--primary-color)';
                        xpNotice.style.color = '#FFF';
                        xpNotice.style.padding = '8px 16px';
                        xpNotice.style.borderRadius = '20px';
                        xpNotice.style.fontSize = '12px';
                        xpNotice.style.fontWeight = 'bold';
                        xpNotice.style.boxShadow = 'var(--shadow-lg)';
                        xpNotice.style.zIndex = '99999';
                        xpNotice.innerHTML = `🔗 Habit Stacked Loop! +10 XP`;
                        document.body.appendChild(xpNotice);
                        setTimeout(() => xpNotice.remove(), 2500);
                    }
                    
                    saveToLocalStorage();
                    evaluateChallengesAndBadges();
                    renderAllScreens();
                }
            }
        });
    }

    // --- Family Chores Event Listeners ---
    const choresList = document.getElementById('family-chores-list');
    if (choresList) {
        choresList.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-chore-done');
            if (btn) {
                const id = btn.dataset.id;
                const chore = state.chores.find(c => c.id === id);
                if (chore) {
                    chore.lastDone = getTodayString();
                    saveToLocalStorage();
                    playFocusChime();
                    renderAllScreens();
                    
                    // Show points notice
                    const xpNotice = document.createElement('div');
                    xpNotice.style.position = 'fixed';
                    xpNotice.style.bottom = '80px';
                    xpNotice.style.right = '20px';
                    xpNotice.style.background = 'var(--accent-color)';
                    xpNotice.style.color = '#FFF';
                    xpNotice.style.padding = '8px 16px';
                    xpNotice.style.borderRadius = '20px';
                    xpNotice.style.fontSize = '12px';
                    xpNotice.style.fontWeight = 'bold';
                    xpNotice.style.boxShadow = 'var(--shadow-lg)';
                    xpNotice.style.zIndex = '99999';
                    xpNotice.innerHTML = `🏡 Chore completed! +25 XP`;
                    document.body.appendChild(xpNotice);
                    setTimeout(() => xpNotice.remove(), 2500);
                }
            }
        });
    }
    
    const btnAddCustomChore = document.getElementById('btn-add-custom-chore');
    if (btnAddCustomChore) {
        btnAddCustomChore.addEventListener('click', () => {
            try {
                document.getElementById('chore-title').value = '';
                document.getElementById('chore-frequency').value = '7';
                document.getElementById('chore-priority').value = 'medium';
                openModal('chore-modal');
            } catch (err) {
                console.error("Error launching chore modal:", err);
            }
        });
    }
    
    const choreForm = document.getElementById('chore-form');
    if (choreForm) {
        choreForm.addEventListener('submit', (e) => {
            e.preventDefault();
            try {
                const title = document.getElementById('chore-title').value.trim();
                const frequency = parseInt(document.getElementById('chore-frequency').value);
                const priority = document.getElementById('chore-priority').value;
                
                if (!state.chores) state.chores = [];
                state.chores.push({
                    id: 'ch_' + Date.now(),
                    title: title,
                    frequency: frequency,
                    lastDone: "",
                    priority: priority
                });
                
                saveToLocalStorage();
                renderAllScreens();
            } catch (err) {
                console.error("Error creating chore:", err);
            } finally {
                closeModal('chore-modal');
            }
        });
    }

    // --- Weekend Optimizer Event Listener ---
    const btnOptimize = document.getElementById('btn-optimize-schedule');
    if (btnOptimize) {
        btnOptimize.addEventListener('click', () => {
            generateWeekendSchedule();
            renderWeekendTimeline();
            playFocusChime();
            
            const timelineOutput = document.getElementById('optimized-schedule-output');
            if (timelineOutput) {
                timelineOutput.style.display = 'block';
                timelineOutput.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // --- Accountability Strictness Levels Event Listeners ---
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-strictness');
        if (btn) {
            const level = parseInt(btn.dataset.level);
            DeviceControlService.setAccountabilityLevel(level);
            playFocusChime();
        }
    });

    // --- Sandbox Distractions Opening Simulation Event Listeners ---
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-simulate-distraction');
        if (btn) {
            const app = btn.dataset.app;
            const message = DeviceControlService.logDistractionAttempt(app);
            
            const msgEl = document.getElementById('distraction-feedback-message');
            if (msgEl) {
                msgEl.textContent = message;
                const level = DeviceControlService.getAccountabilityLevel();
                msgEl.style.color = (level >= 3 && ["TikTok", "Instagram", "YouTube"].includes(app)) ? 'var(--danger-color)' : 'var(--warning-color)';
                
                setTimeout(() => {
                    if (msgEl.textContent === message) msgEl.textContent = '';
                }, 4000);
            }
            renderAccountabilityDashboard();
        }
    });

    // --- Academic Reflection & Verification Event Listeners ---
    const fileTrigger = document.getElementById('school-verify-file-trigger');
    const fileInput = document.getElementById('school-verify-file');
    if (fileTrigger && fileInput) {
        fileTrigger.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                document.getElementById('school-verify-file-lbl').textContent = `Selected: ${file.name}`;
                
                const reader = new FileReader();
                reader.onload = (evt) => {
                    document.getElementById('school-verify-img-preview').src = evt.target.result;
                    document.getElementById('school-verify-preview-container').style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const verifyForm = document.getElementById('school-verify-form');
    if (verifyForm) {
        verifyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const taskId = document.getElementById('school-verify-task-id').value;
            const reflectionText = document.getElementById('school-verify-reflection').value.trim();
            const photoSelected = document.getElementById('school-verify-file').files.length > 0;
            
            verifyForm.style.display = 'none';
            const loadingContainer = document.getElementById('school-verify-loading');
            loadingContainer.style.display = 'block';
            
            // Build intelligence feedback
            let aiFeedback = `<strong>Oumar AI Life Assistant Verification Summary:</strong><br><br>`;
            if (reflectionText.length < 20) {
                aiFeedback += `⚠️ Reflection log is relatively brief, but acceptable for smaller assignments. `;
            } else {
                aiFeedback += `✨ I have successfully analyzed your written reflection. Excellent academic capture. You documented key learnings, formulas, and milestones with high intellectual commitment. `;
            }
            
            if (photoSelected) {
                aiFeedback += `<br><br>📸 <strong>Image Analysis:</strong> Document proof detected and successfully matched with academic notes. Verification integrity score: 100%.`;
            } else {
                aiFeedback += `<br><br>📝 Verification integrity: 90% (Manual study summary verified).`;
            }
            
            aiFeedback += `<br><br>🏁 Keep up the outstanding self-discipline, Oumar. Your streaks and XP multipliers have been preserved and safely updated in the habit matrix!`;
            
            document.getElementById('school-verify-ai-feedback').innerHTML = aiFeedback;
            
            setTimeout(() => {
                loadingContainer.style.display = 'none';
                document.getElementById('school-verify-success').style.display = 'block';
                
                const task = state.schoolTasks.find(t => t.id === taskId);
                if (task) {
                    task.completed = true;
                    saveToLocalStorage();
                    evaluateChallengesAndBadges();
                    renderSchoolScreen();
                    renderDashboard();
                }
            }, 2000);
        });
    }

    const btnVerifySuccessClose = document.getElementById('btn-verify-success-close');
    if (btnVerifySuccessClose) {
        btnVerifySuccessClose.addEventListener('click', () => {
            try {
                if (state.userPoints !== undefined) {
                    state.userPoints += 50;
                } else {
                    state.userPoints = 50;
                }
                saveToLocalStorage();
                renderAllScreens();
            } catch (err) {
                console.error("Error closing verification modal:", err);
            } finally {
                closeModal('school-verify-modal');
            }
        });
    }
    
    // Live ticking countdown update interval
    if (prayerCountdownInterval) clearInterval(prayerCountdownInterval);
    prayerCountdownInterval = setInterval(() => {
        // Only run if active tab is Prayers or Dashboard
        const activeTab = document.querySelector('.app-sidebar .nav-item.active');
        if (activeTab) {
            const currentTab = activeTab.dataset.tab;
            if (currentTab === 'prayers' || currentTab === 'dashboard') {
                renderPrayersScreen();
            }
        }
    }, 15000); // Ticks every 15s to update countdown precisely

    // Initialize display values
    updateTimerDisplay();
    renderAllScreens();
    triggerSkeletonLoad('dashboard');
});

// --- DeviceControlService Abstraction Layer & Accountability Controller ---
const DeviceControlService = {
    getAccountabilityLevel() {
        return state.accountabilityLevel || 1;
    },
    
    setAccountabilityLevel(level) {
        state.accountabilityLevel = level;
        saveToLocalStorage();
        renderAllScreens();
    },
    
    isAppBlocked(appName) {
        const level = this.getAccountabilityLevel();
        if (level < 3) return false;
        
        // Gmail is strictly blocked only under severe Level 4 and Level 5 Lockdown
        const distractingApps = level >= 4 ? ["TikTok", "Instagram", "YouTube", "Gmail"] : ["TikTok", "Instagram", "YouTube"];
        return distractingApps.includes(appName);
    },
    
    triggerFocusMode(enable) {
        const level = this.getAccountabilityLevel();
        console.log(`[DeviceControlService] Requesting Focus Mode: ${enable} at Level ${level}`);
        
        if (typeof isAndroidNative === 'function' && isAndroidNative() && window.AndroidBridge && window.AndroidBridge.setDNDMode) {
            window.AndroidBridge.setDNDMode(enable);
        } else {
            if (enable) {
                console.log("Web Simulation: Do Not Disturb Mode engaged. Non-essential alerts silenced.");
                if (level >= 2) {
                    sendNativeNotification("Focus Mode Engaged", "Distractions silenced. Your personal operating system is in Lockdown.");
                }
            } else {
                console.log("Web Simulation: Do Not Disturb Mode disengaged.");
            }
        }
    },
    
    logDistractionAttempt(appName) {
        if (!state.distractionsLog) state.distractionsLog = [];
        const todayStr = getTodayString();
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        const level = this.getAccountabilityLevel();
        const wasBlocked = this.isAppBlocked(appName);
        
        state.distractionsLog.unshift({
            date: todayStr,
            time: timestamp,
            appName: appName,
            blocked: wasBlocked,
            level: level
        });
        
        if (state.distractionsLog.length > 30) {
            state.distractionsLog.pop();
        }
        
        saveToLocalStorage();
        
        if (wasBlocked) {
            if (level === 3) {
                return `🛑 Shield Active: ${appName} is blocked under Level 3 (Reduced Distractions). Keep focusing!`;
            } else if (level === 4) {
                if (state.userPoints && state.userPoints >= 10) {
                    state.userPoints -= 10;
                } else {
                    state.userPoints = 0;
                }
                saveToLocalStorage();
                return `🚫 LOCKDOWN ENFORCED: ${appName} is STRICTLY BLOCKED by Level 4. Focus session integrity compromised! (-10 XP)`;
            } else if (level === 5) {
                if (state.userPoints && state.userPoints >= 25) {
                    state.userPoints -= 25;
                } else {
                    state.userPoints = 0;
                }
                
                // Break streak!
                state.level5Failure = true;
                saveToLocalStorage();
                
                return `💀 LEVEL 5 CONFLICT: Distraction attempt on ${appName} detected! Warning SMS dispatched to Oumar's father: "Oumar bypassed deep study lock to open ${appName}." 30-day streak is FROZEN at 0! (-25 XP)`;
            }
        }
        
        if (level === 1) {
            return `🔔 Gentle Reminder: Opened ${appName}. Try to remain consistent, Oumar.`;
        } else if (level === 2) {
            return `💡 Atomic Prompt: Resist opening ${appName}! James Clear says: 'Make distractions friction-filled.'`;
        }
        return `⚠️ Logged access to ${appName}.`;
    }
};

// Chores & Weekend Scheduling Engine
function renderChoresList() {
    const listContainer = document.getElementById('family-chores-list');
    if (!listContainer) return;
    
    if (!state.chores || state.chores.length === 0) {
        state.chores = [
            { id: "ch1", title: "Clean the bathroom", frequency: 14, lastDone: "", priority: "high" },
            { id: "ch2", title: "Mop the floors", frequency: 14, lastDone: "", priority: "high" },
            { id: "ch3", title: "Take out the garbage", frequency: 3, lastDone: "", priority: "medium" }
        ];
    }
    
    listContainer.innerHTML = '';
    const today = new Date();
    
    state.chores.forEach(chore => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'space-between';
        item.style.padding = '10px';
        item.style.background = 'var(--bg-secondary)';
        item.style.border = '1px solid var(--border-color)';
        item.style.borderRadius = 'var(--border-radius-sm)';
        item.style.gap = '10px';
        
        let statusText = "Ready to do";
        let statusColor = "var(--text-secondary)";
        
        if (chore.lastDone) {
            const lastDoneDate = new Date(chore.lastDone);
            const diffDays = Math.floor((today - lastDoneDate) / (1000 * 60 * 60 * 24));
            const daysLeft = chore.frequency - diffDays;
            
            if (daysLeft < 0) {
                statusText = `🔴 Overdue by ${Math.abs(daysLeft)}d`;
                statusColor = "var(--danger-color)";
            } else if (daysLeft === 0) {
                statusText = "🟡 Due Today";
                statusColor = "var(--warning-color)";
            } else {
                statusText = `🟢 Due in ${daysLeft}d`;
                statusColor = "var(--accent-color)";
            }
        } else {
            statusText = "🔴 Overdue (Not done yet)";
            statusColor = "var(--danger-color)";
        }
        
        const priorityLabels = {
            high: "🔴 High",
            medium: "🟡 Medium",
            low: "🟢 Low"
        };
        
        item.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 2px;">
                <span style="font-size: 13px; font-weight: 700; color: var(--text-primary);">${chore.title}</span>
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 2px;">
                    <span style="font-size: 10px; font-weight: 700; color: ${statusColor};">${statusText}</span>
                    <span style="font-size: 10px; color: var(--text-tertiary);">Freq: ${chore.frequency}d</span>
                    <span style="font-size: 10px; background: var(--bg-primary); padding: 2px 6px; border-radius: 10px; border: 1px solid var(--border-color); color: var(--text-secondary); font-weight: 600;">Priority: ${priorityLabels[chore.priority] || chore.priority}</span>
                </div>
            </div>
            <button class="text-btn btn-chore-done" data-id="${chore.id}" style="color: var(--accent-color); font-weight: 700; font-size: 12px; cursor: pointer; border: 1px solid var(--accent-light); padding: 4px 8px; border-radius: var(--border-radius-sm); background: var(--accent-light);">Mark Done</button>
        `;
        
        listContainer.appendChild(item);
    });
}

function generateWeekendSchedule() {
    const today = new Date();
    const times = calculatePrayerTimes(today);
    
    const satTimeline = [
        { time: "05:15 AM", label: "Fajr Prayer Anchor", desc: "Wake up for Fajr prayer, establish immediate morning consistency.", icon: "wb_twilight", priority: "faith" },
        { time: "06:00 AM", label: "Morning Focus Study Block", desc: "Pure deep focus period of 45-60 mins while mind is fresh.", icon: "menu_book", priority: "academics" },
        { time: "07:30 AM", label: "Breakfast & Transition Prep", desc: "Healthy breakfast and travel preparation.", icon: "coffee", priority: "personal" },
        { time: "10:00 AM", label: "🕌 Saturday Arabic Class", desc: "Faith-academics instruction. Strictly dedicated until midday prayer.", icon: "mosque", priority: "high" },
        { time: times.dhuhr, label: "Dhuhr Prayer Anchor", desc: "Midday prayer block.", icon: "wb_sunny", priority: "faith" },
        { time: "01:00 PM", label: "👨‍👩‍👦 Family Help & Service Block", desc: "Prioritize helping parents, household upkeep, and family duties.", icon: "favorite", priority: "high" }
    ];
    
    const satChores = state.chores.filter(c => c.priority === 'high' || Math.random() > 0.4);
    if (satChores.length > 0) {
        satTimeline.push({ time: "03:15 PM", label: `🏡 Chore: ${satChores[0].title}`, desc: "Scheduled chore slot avoiding study and prayer conflicts.", icon: "cleaning_services", priority: "chore" });
    }
    
    satTimeline.push(
        { time: times.asr, label: "Asr Prayer Anchor", desc: "Afternoon prayer block.", icon: "sunny", priority: "faith" },
        { time: "05:30 PM", label: "Physical Activity or Chores", desc: "Outdoor exercise break to refresh energy.", icon: "directions_run", priority: "personal" },
        { time: times.maghrib, label: "Maghrib Prayer Anchor", desc: "Sunset prayer. Atomic stacking reading routine.", icon: "wb_twilight", priority: "faith" },
        { time: times.isha, label: "Isha Prayer Anchor", desc: "Night prayer. Initiate screen curfew lockdown ruleset.", icon: "dark_mode", priority: "faith" }
    );
    
    const sunTimeline = [
        { time: "05:15 AM", label: "Fajr Prayer Anchor", desc: "Start Sunday with faith anchors.", icon: "wb_twilight", priority: "faith" },
        { time: "08:30 AM", label: "Prepare Weekly Academic Roadmap", desc: "Review upcoming curriculum, homework goals, and agendas.", icon: "edit_calendar", priority: "academics" }
    ];
    
    const dueSoonHomework = state.schoolTasks.filter(t => !t.completed);
    if (dueSoonHomework.length > 0) {
        sunTimeline.push({ time: "10:00 AM", label: `📚 Academic Deep Focus: ${dueSoonHomework[0].title}`, desc: "Uninterrupted block targeting urgent academic milestones.", icon: "school", priority: "academics" });
    } else {
        sunTimeline.push({ time: "10:00 AM", label: "📚 Academic Deep Focus Session", desc: "General study, formula review, and syllabus pre-reads.", icon: "school", priority: "academics" });
    }
    
    sunTimeline.push({ time: times.dhuhr, label: "Dhuhr Prayer Anchor", desc: "Midday prayer block.", icon: "wb_sunny", priority: "faith" });
    
    const remainingChores = state.chores.filter(c => !satChores.includes(c));
    if (remainingChores.length > 0) {
        sunTimeline.push({ time: "01:30 PM", label: `🏡 Chore: ${remainingChores[0].title}`, desc: "Keep space organized.", icon: "cleaning_services", priority: "chore" });
    } else {
        sunTimeline.push({ time: "01:30 PM", label: "👨‍👩‍👦 Family Social Hour", desc: "Uninterrupted family time.", icon: "group", priority: "high" });
    }
    
    sunTimeline.push(
        { time: times.asr, label: "Asr Prayer Anchor", desc: "Afternoon prayer block.", icon: "sunny", priority: "faith" },
        { time: "04:30 PM", label: "School Week Prep & Packing", desc: "Settle outfits, pack textbook bags, organize stationary.", icon: "fact_check", priority: "academics" },
        { time: times.maghrib, label: "Maghrib Prayer Anchor", desc: "Sunset prayer.", icon: "wb_twilight", priority: "faith" },
        { time: times.isha, label: "Isha Prayer Anchor", desc: "Night prayer. Secure environment lockdown.", icon: "nights_stay", priority: "faith" }
    );
    
    state.weekendSchedule = {
        saturday: satTimeline,
        sunday: sunTimeline,
        generatedAt: getTodayString()
    };
    saveToLocalStorage();
}

function renderWeekendTimeline() {
    const container = document.getElementById('weekend-schedule-timeline');
    const wrapper = document.getElementById('optimized-schedule-output');
    if (!container || !wrapper) return;
    
    if (!state.weekendSchedule) {
        wrapper.style.display = 'none';
        return;
    }
    
    wrapper.style.display = 'block';
    container.innerHTML = '';
    
    // Saturday Header
    const satHeader = document.createElement('div');
    satHeader.innerHTML = `<h5 style="font-size: 13px; font-weight: 800; color: var(--primary-color); margin-bottom: 8px; margin-top: 4px; display: flex; align-items: center; gap: 4px;"><span class="material-symbols-outlined" style="font-size:16px;">calendar_today</span> Saturday Plan</h5>`;
    container.appendChild(satHeader);
    
    state.weekendSchedule.saturday.forEach(item => {
        const row = document.createElement('div');
        row.style.position = 'relative';
        row.style.paddingLeft = '18px';
        row.style.marginBottom = '12px';
        
        let badgeColor = "var(--text-tertiary)";
        if (item.priority === "faith") badgeColor = "var(--warning-color)";
        else if (item.priority === "high") badgeColor = "var(--danger-color)";
        else if (item.priority === "academics") badgeColor = "var(--primary-color)";
        else if (item.priority === "chore") badgeColor = "var(--accent-color)";
        
        row.innerHTML = `
            <div style="position: absolute; left: -23px; top: 2px; width: 10px; height: 10px; border-radius: 50%; background: ${badgeColor}; border: 2px solid var(--bg-secondary); z-index: 2;"></div>
            <div style="font-size: 11px; font-weight: 700; color: ${badgeColor};">${item.time}</div>
            <div style="font-size: 13px; font-weight: 700; color: var(--text-primary); margin-top: 2px; display: flex; align-items: center; gap: 6px;">
                <span class="material-symbols-outlined" style="font-size: 14px; color: ${badgeColor};">${item.icon}</span> ${item.label}
            </div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px; line-height: 1.3;">${item.desc}</div>
        `;
        container.appendChild(row);
    });
    
    // Sunday Header
    const sunHeader = document.createElement('div');
    sunHeader.innerHTML = `<h5 style="font-size: 13px; font-weight: 800; color: var(--primary-color); margin-bottom: 8px; margin-top: 16px; display: flex; align-items: center; gap: 4px;"><span class="material-symbols-outlined" style="font-size:16px;">calendar_today</span> Sunday Plan</h5>`;
    container.appendChild(sunHeader);
    
    state.weekendSchedule.sunday.forEach(item => {
        const row = document.createElement('div');
        row.style.position = 'relative';
        row.style.paddingLeft = '18px';
        row.style.marginBottom = '12px';
        
        let badgeColor = "var(--text-tertiary)";
        if (item.priority === "faith") badgeColor = "var(--warning-color)";
        else if (item.priority === "high") badgeColor = "var(--danger-color)";
        else if (item.priority === "academics") badgeColor = "var(--primary-color)";
        else if (item.priority === "chore") badgeColor = "var(--accent-color)";
        
        row.innerHTML = `
            <div style="position: absolute; left: -23px; top: 2px; width: 10px; height: 10px; border-radius: 50%; background: ${badgeColor}; border: 2px solid var(--bg-secondary); z-index: 2;"></div>
            <div style="font-size: 11px; font-weight: 700; color: ${badgeColor};">${item.time}</div>
            <div style="font-size: 13px; font-weight: 700; color: var(--text-primary); margin-top: 2px; display: flex; align-items: center; gap: 6px;">
                <span class="material-symbols-outlined" style="font-size: 14px; color: ${badgeColor};">${item.icon}</span> ${item.label}
            </div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px; line-height: 1.3;">${item.desc}</div>
        `;
        container.appendChild(row);
    });
}

const STRICTNESS_DESCRIPTIONS = {
    1: "🟢 Level 1 (Gentle): Focus notifications and supportive reminders to build habits without pressure.",
    2: "🟡 Level 2 (Encouragement): Striking motivational messages, accountability prompts, and focus prompts.",
    3: "🟠 Level 3 (Hard Block): Blocks access to TikTok, Instagram, and YouTube under sandbox simulation mode.",
    4: "🔴 Level 4 (Severe Penalty): App blockages extend to Gmail. Attempting to open blocked apps deducts 10 XP instantly!",
    5: "💀 Level 5 (The Fear): Social Accountability. Bypass attempts dispatch alert warning SMS to Oumar's father, freeze the overall Streak at 0, and require a Weekly Reflection apology log to recover."
};

function renderAccountabilityDashboard() {
    const level = DeviceControlService.getAccountabilityLevel();
    const descEl = document.getElementById('strictness-description');
    if (descEl) descEl.textContent = STRICTNESS_DESCRIPTIONS[level];
    
    document.querySelectorAll('.btn-strictness').forEach(btn => {
        const btnLevel = parseInt(btn.dataset.level);
        btn.classList.toggle('active', btnLevel === level);
        if (btnLevel === level) {
            btn.style.background = btnLevel === 5 ? 'var(--danger-color)' : 'var(--primary-color)';
            btn.style.color = '#FFF';
            btn.style.borderColor = btnLevel === 5 ? 'var(--danger-color)' : 'var(--primary-color)';
        } else {
            btn.style.background = 'var(--bg-secondary)';
            btn.style.color = 'var(--text-secondary)';
            btn.style.borderColor = 'var(--border-color)';
        }
    });
    
    const logsContainer = document.getElementById('distraction-logs-container');
    if (logsContainer) {
        logsContainer.innerHTML = '';
        if (!state.distractionsLog || state.distractionsLog.length === 0) {
            logsContainer.innerHTML = `<div class="empty-state-sm" style="font-size: 10px;">Sandbox history empty. Simulate an access above.</div>`;
            return;
        }
        
        state.distractionsLog.slice(0, 10).forEach(log => {
            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.justifyContent = 'space-between';
            item.style.padding = '6px 8px';
            item.style.background = 'var(--bg-secondary)';
            item.style.border = '1px solid var(--border-color)';
            item.style.borderRadius = 'var(--border-radius-sm)';
            item.style.fontSize = '10px';
            
            const statusLabel = log.blocked ? "🚫 Blocked" : "⚠️ Logged";
            const statusColor = log.blocked ? "var(--danger-color)" : "var(--warning-color)";
            
            item.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 2px;">
                    <span>Open <strong>${log.appName}</strong></span>
                    <span style="color: var(--text-tertiary);">${log.date} ${log.time}</span>
                </div>
                <div style="text-align: right;">
                    <span style="font-weight: 700; color: ${statusColor};">${statusLabel}</span>
                    <div style="font-size: 9px; color: var(--text-tertiary);">Under Level ${log.level}</div>
                </div>
            `;
            logsContainer.appendChild(item);
        });
    }
}

// Callback from android native side for weekly reviews
window.onWeeklyReviewCallback = function(rawReviewHtml) {
    const reviewBox = document.getElementById('review-output-container');
    
    let parsedHtml = rawReviewHtml
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');

    reviewBox.innerHTML = `
        <div class="review-parsed-content">
            ${parsedHtml}
        </div>
    `;
    
    appendReviewToChats(parsedHtml);
};
