const Meal = require('../models/Meal');
const scoreCalculator = require('./scoreCalculator');

/**
 * Provided dietary recommendations to a user based on their BMI and 
 * average calorie/fat/protein/carb intake.
 * 
 * @param {UserProfile} userProfile A UserProfile object from MongoDB Cloud.
 * @return {Object} A JSON obj with the following pattern:
 *  {
 *      bmiRecommendation: '...', // Some bmi recommendation
 *      dietRecommendations: '...', // Some diet intake recommendations
 *  }
 */
const provideRecommendations = async (userProfile) => {
    const email = userProfile.email;

    if (!userProfile.age || typeof(userProfile.heightFeet) !== 'number' 
        || typeof(userProfile.heightInches) !== 'number' || !userProfile.weight 
        || !userProfile.weightGoal || !userProfile.muscleMassGoal)
        return -1;

    // Find the user's meals
    let meals = await Meal.find({ email: email }).exec();
    // Check if the user has meals
    if (!meals || meals.length < 3) return -1;

    // Calculate BMI
    const heightMeters = (userProfile.heightFeet * 12 + userProfile.heightInches) * 0.0254; // 1 ft = 0.0254 m
    const weightKg = userProfile.weight * 0.453592; // 1 lb = 0.453592 kg
    const bmi = scoreCalculator.calculateBmi(heightMeters, weightKg);
    
    // Initialize recommendations
    var bmiRecommendation = {
        category: 'at-weight', // Default: 20 <= bmi <= 25
        bmi: bmi.toFixed(1)
    };
    var dietRecommendations = {};
    
    // set BMI category
    if (bmi < 20)                   bmiRecommendation.category = 'underweight';
    else if (25 < bmi && bmi < 30)  bmiRecommendation.category = 'overweight';
    else if (30 <= bmi)             bmiRecommendation.category = 'obese';

    // Calc avg macro intake per/day (assuming 3 meals per day)
    let avgCalories = meals.reduce((totalCalories, meal) => totalCalories + meal.calories, 0) / meals.length * 3;
    let avgProtein = meals.reduce((totalProtein, meal) => totalProtein + meal.protein, 0) / meals.length * 3;
    let avgCarbs = meals.reduce((totalCarbs, meal) => totalCarbs + meal.carbs, 0) / meals.length * 3;
    let avgFat = meals.reduce((totalFat, meal) => totalFat + meal.fat, 0) / meals.length * 3;
    
    // Set avg macro amounts in recommmendations
    dietRecommendations.avgCalories = Math.ceil(avgCalories);
    dietRecommendations.avgProtein = Math.ceil(avgProtein);
    dietRecommendations.avgCarbs = Math.ceil(avgCarbs);
    dietRecommendations.avgFat = Math.ceil(avgFat);

    // Calc user's resting calorie needs
    let basalMetabolicRate = 66.5 + (13.75 * weightKg) + (5.003 * heightMeters * 100) - (6.75 * userProfile.age);
    let userActityLevel = userProfile.weightGoal === 'Loose' ? 1.4 : userProfile.weightGoal === 'Gain' ? 1.65 : 1.5;
    
    // Calc user's requried macors
    let requiredCalories = basalMetabolicRate * userActityLevel;
    let requiredProtein = userProfile.muscleMassGoal === 'Loose' ? 
      userProfile.weight * 0.33
      : userProfile.muscleMassGoal === 'Gain' ?
        userProfile.weight * 0.4
        : userProfile.weight * 0.3636;
    let requiredCarbs = requiredCalories * .5 / 4;
    let requiredFat = requiredCalories * .2 / 9;
    
    // Set requried macro amounts in recommmendations
    dietRecommendations.requiredCalories = Math.ceil(requiredCalories);
    dietRecommendations.requiredProtein = Math.ceil(requiredProtein);
    dietRecommendations.requiredCarbs = Math.ceil(requiredCarbs);
    dietRecommendations.requiredFat = Math.ceil(requiredFat);
    
    // Calculate difference between requried and actual avg macros 
    let calorieDifference = Math.abs(requiredCalories - avgCalories);
    let proteinDifference = Math.abs(requiredProtein - avgProtein);
    let carbDifference =    Math.abs(requiredCarbs - avgCarbs);
    let fatDifference =     Math.abs(requiredFat - avgFat);

    // Provide statements to display about macros
    if (calorieDifference >= 100)
        dietRecommendations.calorieRecommendation = `Your average calorie intake is ${avgCalories.toFixed(2)} cal/day, when you should intake close to ${requiredCalories.toFixed(2)} cals/day!`;
    if (proteinDifference >= 5)
        dietRecommendations.proteinRecommendation = `Your average protein intake is ${avgProtein.toFixed(2)} g/day, when you should intake close to ${requiredProtein.toFixed(2)} g/day!`;
    if (carbDifference >= 20)
        dietRecommendations.carbsRecommendation = `Your average carbohydrate intake is ${avgCarbs.toFixed(2)} g/day, when you should intake close to ${requiredCarbs.toFixed(2)} g/day!`;
    if (fatDifference >= 5)
        dietRecommendations.fatRecommendation = `Your average fat intake is ${avgFat.toFixed(2)} g/day, when you should intake close to ${requiredFat.toFixed(2)} g/day!`;
    
    return {
        bmi: bmiRecommendation,
        diet: dietRecommendations
    };
}

module.exports.provideRecommendations = provideRecommendations;