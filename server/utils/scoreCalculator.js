const Meal = require('../models/Meal');
const Sleep = require('../models/Sleep');
const Workout = require('../models/Workout');

/**
 * Calcules a user's wellness score. A wellness score is an arbitrary
 * ranking system that accounts for:
 *      
 *      - BMI
 *      - number/intensity of workouts per week (must have at least 3 workouts logged)
 *      - average calorie/fat/protein/carb intake (must have at least 3 meals logged)
 *      - sleeping patterns (must have at least 3 sleeps logged)
 * 
 * Wellness scores have a minimum of 0 and a maximum 
 * of 100. In practice no one is likely to recieve the minimum score
 * of 0, but it is possible to achieve a score of 100. The score will
 * be calculated as follows ('(' or ')' mean exclusive,
 * '[' or ']' mean inclusive):
 *      
 *      - 30 points: BMI
 *          = Points will be assigned for BMI as follows:
 *              +  (0, 16) = 0 pts
 *              +  [17, 18) = 5 pts
 *              +  [18, 19) = 15 pts
 *              +  [19, 20) = 20 pts
 *              +  [20, 25] = 30 pts
 *              +  (25, 27) = 20 pts
 *              +  [27, 29) = 15 pts
 *              +  [29, 31) = 5 pts
 *              +  [31, INF) = 0 pts
 * 
 *      - 20 points: number/intensity of workouts per week
 *          = We will give the user pionts gradually for the amount and intensity of workouts
 *              they've logged in the past 7 days.
 *              + 5 points per high intensity workout
 *              + 4 points per medium intensity workout
 *              + 2 points per low intensity workout
 * 
 *      - 25 points: average calorie/fat/protein/carb intake
 *          = 7 points will be assigned for average calorie intake.
 *              Average calorie intake will be compared to a user's
 *              calculated calorie needs (calculated using the
 *              Harris-Benedict Formula described here: 
 *              https://www.omnicalculator.com/health/bmr-harris-benedict-equation). 
 *              Points will be given as follows:
 *                  7 - floor(abs('calculated calories' - avg. calories) / 50)
 * 
 *          = 7 points will be assigned for average protein intake.
 *              Average protein intake will be compared to a user's
 *              calculated protein needs (calculated by: weight * 0.3636). 
 *              Points will be given as follows:
 *                  7 - (avg. protein < 'calculated protein' ? floor(abs('calculated protein' - avg. protein) / 2) : 0)
 * 
 *          = 6 points will be assigned for average carb intake.
 *              Average carb intake will be compared to a user's
 *              calculated carb needs. Carb intake needs will be calculated by: 
 *                  calulated calories * .5 / 4 (calories/gram)
 * 
 *              Points will be given as follows:
 *                  6 - floor(abs('calculated carbs' - avg. carbs) / 3)
 * 
 *          = 5 points will be assigned for average fat intake.
 *              Average fat intake will be compared to a user's
 *              calculated fat needs. Fat intake needs will be calculated by: 
 *                  calulated calories * .2 / 9 (calories/gram)
 * 
 *              Points will be given as follows:
 *                  5 - floor(abs('calculated fat' - avg. fat) / 3)
 * 
 *      - 25 points: sleeping patterns
 *          = We will assume that adults should get an average of 8.0 hours (480 mins) of
 *            sleep per night and users average sleep is in the. Points will be awarded in 
 *            a simple fashion:
 *              25 - (avg. sleep mins < 480 ? (abs(480 - avg. sleep mins) / 10) * 2 : 0)
 * 
 * @param {UserProfile} userProfile A UserProfile object from MongoDB Cloud.
 * @return {int} A number between 0 and 100 arbitrarily rating a user's fitness.
 */
const calculateWellnessScore = async (userProfile) => {
    var bmiPoints = 0;
    var mealPoints = 0;
    var sleepPoints = 25;
    var workoutPoints = 0;

    const email = userProfile.email;    
    const heightMeters = (userProfile.heightFeet * 12 + userProfile.heightInches) * 0.0254; // 1 ft = 0.0254 m
    const weightKg = userProfile.weight * 0.453592; // 1 lb = 0.453592 kg
    // Give points for BMI
    const bmi = calculateBmi(heightMeters, weightKg);
    if (17 <= bmi && bmi < 18)
        bmiPoints = 5;
    else if (18 <= bmi && bmi < 19)
        bmiPoints = 15;
    else if (19 <= bmi && bmi < 20)
        bmiPoints = 20;
    else if (20 <= bmi && bmi <= 25)
        bmiPoints = 30;
    else if (25 < bmi && bmi < 27)
        bmiPoints = 20;
    else if (27 <= bmi && bmi < 29)
        bmiPoints = 15;
    else if (29 <= bmi && bmi < 31)
        bmiPoints = 5;

        

    // Get workouts in the past 7 days
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    let workouts = await Workout.find({ email: email , date: { $gt: startDate.valueOf() } }).exec();
    // Check if the user has workouts
    if (!workouts) 
        return -3;
    else if (workouts.length < 3)
        return -3;


    // Calculate workout points
    workoutPoints = workouts.reduce((totalPoints, workout) => 
        workout.intensity === 'High' ? totalPoints+5 : (workout.intensity === 'Medium' ? totalPoints+4 : totalPoints+2),
        0
    );
    if (workoutPoints > 20) workoutPoints = 20;


    
    // Find the user's meals
    let meals = await Meal.find({ email: email }).exec();
    // Check if the user has meals
    if (!meals) 
        return -1;
    else if (meals.length < 3)
        return -1;

    let avgCalories = meals.reduce((totalCalories, meal) => totalCalories + meal.calories, 0) / meals.length;
    let avgProtein = meals.reduce((totalProtein, meal) => totalProtein + meal.protein, 0) / meals.length;
    let avgCarbs = meals.reduce((totalCarbs, meal) => totalCarbs + meal.carbs, 0) / meals.length;
    let avgFat = meals.reduce((totalFat, meal) => totalFat + meal.fat, 0) / meals.length;

    // The user's resting calorie needs
    let basalMetabolicRate = 66.5 + (13.75 * weightKg) + (5.003 * heightMeters * 100) - (6.75 * userProfile.age);
    let userActityLevel = userProfile.weightGoal === 'Loose' ? 1.4 : userProfile.weightGoal === 'Gain' ? 1.65 : 1.5;
    let caloriesNeeded = basalMetabolicRate * userActityLevel;
    let proteinNeededGrams = userProfile.weight * 0.3636;
    let carbsNeededGrams = caloriesNeeded * .5 / 4;
    let fatNeededGrams = caloriesNeeded * .2 / 9;
    
    let caloriePoints = 7 - Math.floor(Math.abs(caloriesNeeded - avgCalories) / 50);
    let proteinPoints = 7 - (avgProtein < proteinNeededGrams ? Math.floor(Math.abs(proteinNeededGrams - avgProtein) / 2) : 0);
    let carbPoints =    6 - Math.floor(Math.abs(carbsNeededGrams - avgCarbs) / 3);
    let fatPoints =     5 - Math.floor(Math.abs(fatNeededGrams - avgFat) / 3);
    if (caloriePoints < 0) caloriePoints = 0;
    if (proteinPoints < 0) proteinPoints = 0;
    if (carbPoints < 0) carbPoints = 0;
    if (fatPoints < 0) fatPoints = 0;
    mealPoints = caloriePoints + proteinPoints + carbPoints + fatPoints;


    
    // Find the user's sleeps
    let sleeps = await Sleep.find({ email: email }).exec();
    // Check if the user has sleeps
    if (!sleeps) 
        return -2;
    else if (sleeps.length < 3)
        return -2;

    let avgSleepMins = sleeps.reduce((totalMins, sleep) => 
        totalMins + (new Date(sleep.endDate).valueOf() - new Date(sleep.startDate).valueOf()) * 0.001 / 60,
        0
        ) / sleeps.length;
    const requiredMins = 480;
    // Calculate sleep points
    sleepPoints -= (avgSleepMins < requiredMins ? (Math.abs(requiredMins - avgSleepMins) / 10) * 2 : 0)
    
    return (bmiPoints + workoutPoints + mealPoints + sleepPoints).toFixed(2);
}

/**
 * Calcules a person's BMI.
 * 
 * @param {double} height Height of the person in meters
 * @param {double} weight Weight of the person in kilograms
 * @return {double} The BMI of the person where the range of 
 * values is as follows:
 *        
 *        - Underweight = (0, 18.5]
 *        - Normal weight = [18.5, 25)
 *        - Overweight = [25 – 30)
 *        - Obesity = [30, INF)
 */
const calculateBmi = (heightMeters, weightKg) => {
    return weightKg / Math.pow(heightMeters, 2);
}

module.exports.calculateWellnessScore = calculateWellnessScore;
module.exports.calculateBmi = calculateBmi;