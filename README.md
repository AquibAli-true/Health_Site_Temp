Chapter 1: Selected SDG and Reason for Selection
1.1 Selected United Nations Sustainable Development Goal
The United Nations Sustainable Development Goal (SDG) selected as the foundational framework for this project is SDG 3: Good Health and Well-being. This goal serves as a global blueprint for addressing modern health crises through technological and systemic innovations.
1.2 Core Focus of SDG 3
SDG 3 focuses broadly on ensuring healthy lives and promoting well-being for all individuals at all stages of life. While the goal covers a wide spectrum of global health priorities—such as reducing maternal mortality, ending epidemics of communicable diseases, and strengthening health systems—a major sub-target is the prevention and treatment of non-communicable diseases (NCDs). A critical, actionable path toward achieving this target involves combating lifestyle-related health risks through preventative care, healthy weight management, and optimal nutritional awareness.
1.3 Importance of the Issue
In the modern landscape of global health, poor dietary habits and nutritional ignorance have evolved into a silent epidemic. This issue is highly significant for several reasons:
•	The Rise of Lifestyle Diseases: Caloric surpluses, highly processed foods, and systemic imbalances in macronutrients (proteins, fats, and carbohydrates) are leading directly to an unprecedented rise in chronic conditions like Type 2 diabetes, obesity, hypertension, and cardiovascular diseases.
•	Lack of Consumer Awareness: While nutritional labels are legally mandated on products, the average individual lacks a practical, aggregate understanding of what they consume daily. Tracking metrics manually is tedious, leading to tracking fatigue and data abandonment.
•	Economic Burden: Preventable lifestyle conditions put an immense, unnecessary strain on healthcare infrastructure and family economies worldwide, which could be heavily mitigated through proactive, individualized dietary management.
1.4 Reason for Selection and Real-World Impact
This issue was selected because bridging the gap between raw health data and active consumer awareness is an ideal challenge for software engineering. Real-world health interventions are most effective when they empower individuals with immediate, personalized data.
By building a digital Food Logger that integrates both a certified generic food database (USDA) and custom entry options, this project creates a direct, practical tool for satisfying SDG 3 targets. It shifts health management from a reactive framework (treating a disease after it develops) to a proactive framework (preventing disease through daily micro-habits and macro-nutrient tracking).
Chapter 2: Problem Statement
2.1 What is the Problem?
The core problem is the lack of accessible, data-driven tools for individuals to accurately track and manage their daily nutritional intake against personalized health targets. While people generally know they should "eat healthy," they rely heavily on guesswork rather than quantitative data. Specifically, individuals struggle to monitor their exact caloric consumption and macronutrient breakdown (proteins, carbohydrates, and fats) on a meal-by-meal basis, making it incredibly difficult to maintain a calculated caloric deficit, surplus, or maintenance level required for healthy weight management.
2.2 Where Does This Problem Exist?
This problem exists primarily in modern, urbanized societies and digital-first environments. In these settings, the daily default consists of highly processed, calorie-dense foods combined with largely sedentary, screen-based lifestyles. The modern food environment makes passive overeating incredibly easy, while the fast-paced nature of daily life makes manual nutritional tracking (like reading physical labels or keeping pen-and-paper food diaries) impractical and unsustainable for the average person.
2.3 Who is Affected?
This issue affects a vast demographic, specifically:
•	The General Adult Population: Individuals unknowingly consuming hidden calories and inadequate protein, leading to gradual, unintended weight gain.
•	Individuals with Pre-existing Conditions: People managing or at risk for metabolic syndrome, Type 2 diabetes, or cardiovascular issues who require strict dietary monitoring.
•	Fitness Enthusiasts and Dieters: Users actively trying to reach specific body composition goals (weight loss or muscle gain) who frequently fail due to miscalculated macro-nutrient intake.
2.4 Why is it Serious?
The inability to accurately track daily nutrition is a serious catalyst for the global rise in non-communicable diseases (NCDs). Relying on intuition rather than data frequently results in a chronic caloric surplus and severe macronutrient imbalances (such as dangerously low protein intake paired with high refined carbohydrates). Over months and years, this biological compounding directly causes obesity, insulin resistance, hypertension, and systemic inflammation. It transforms a simple lack of daily data into severe, life-altering chronic illnesses.
2.5 What Could Happen if it is Not Solved?
If this gap in nutritional awareness is not solved, the prevalence of diet-related chronic illnesses will continue to accelerate globally. On an individual level, people will continue to experience failed health interventions, fluctuating weight cycles ("yo-yo dieting"), and declining physical well-being. On a macro level, the unchecked rise in obesity and preventable metabolic diseases will result in significantly lower life expectancies and place an unsustainable financial burden on healthcare infrastructures worldwide. Without a digital intervention that makes daily tracking effortless and insightful, the population will remain unequipped to make informed physiological choices.

Chapter 3: Proposed Solution
3.1 What is the Project?
The proposed solution is Diet+, a comprehensive, full-stack web application designed to simplify personal nutritional tracking and dietary management. Diet+ functions as a centralized, interactive daily dashboard where users can accurately log their meals, monitor their weight trends, and view their exact macronutrient breakdown in real-time. By transforming complex nutritional data into an intuitive, highly visual interface, the application bridges the gap between raw dietary science and actionable daily habits.
3.2 How the System Works
Diet+ operates on a modern, unidirectional data architecture (utilizing a React frontend, Node.js backend, and MongoDB database) to ensure seamless user interaction. The system works through several interconnected modules:
•	Target Initialization: Users begin by setting their daily caloric and macronutrient goals (e.g., Calorie Budget and Protein Progress), which generate a unique daily log in the database.
•	Intelligent Food Logging: The core "Food Logger" component allows users to search for items across different meal categories (Breakfast, Lunch, Dinner, Snacks). The system queries the USDA National Nutrient Database to retrieve highly accurate, scientifically validated macro profiles for generic foods. It also allows for "Custom Entries" for unique or home-cooked meals.
•	Real-Time Data Visualization: As items are logged, the backend aggregates the data and immediately updates the frontend. This is displayed via dynamic, color-coded rings on the "Today's Dashboard" that show precisely how many calories are left and how many grams of protein are remaining for the day.
•	Deep-Dive Nutrition Inspector: When a user clicks on a logged item, the "Nutrition Inspector Panel" dynamically populates, offering a granular breakdown of calories, protein, carbohydrates, and total fats for that specific entry.
•	Integrated AI Assistance: The application features a dedicated "Ask AI" tab, providing users with an on-demand, intelligent assistant to answer dietary questions, suggest meal alternatives, or explain nutritional concepts without leaving the platform.
3.3 How it Helps Solve the Problem
Diet+ directly addresses the problem of "nutritional guesswork" outlined in the previous chapter.
•	Removes Ambiguity: Instead of estimating intake, users rely on precise USDA data or exact custom inputs, effectively preventing the accidental caloric surplus that leads to weight gain and metabolic issues.
•	Reduces Tracking Fatigue: The heavy automation—such as the auto-calculation of macros and seamless API search—removes the tedious nature of traditional pen-and-paper tracking.
•	Promotes Proactive Health Management: The visual feedback loops (like the macro rings and the long-term "Weight Trend" graph) provide instant psychological reward and accountability. Users can clearly see if they are undereating protein or overeating fats before the day ends, allowing them to adjust their next meal accordingly.
3.4 Who Will Use the Application
The application is designed for a broad but highly motivated demographic, specifically:
•	The General Public: Individuals looking to lose, gain, or maintain weight through a safe, calculated approach rather than relying on restrictive "fad" diets.
•	Fitness Enthusiasts: Bodybuilders, athletes, and gym-goers who require strict adherence to macronutrient splits (especially high protein intake) to achieve specific body composition goals.
•	Health-Conscious Patients: Individuals working alongside healthcare providers who have been advised to carefully monitor their daily carbohydrate, fat, or caloric intake to manage conditions like Type 2 diabetes or hypertension.


Chapter 4: Project Features
4.1 User Registration and Health Profile Initialization
This feature provides a secure onboarding form that captures essential user details including Name, Email, and Password, alongside critical biometric markers like Sex, Age, Height (cm), and Weight (kg). The system uses these metrics to automatically calculate baseline metabolic needs and initialize customized daily macronutrient goals.
4.2 Dynamic Daily Dashboard and Historical Navigation
The core application dashboard auto-renews at midnight every day to offer a fresh tracking slate, while incorporating date-navigation controls that allow users to seamlessly review historical logs. It features interactive, color-coded tracking rings that visually countdown remaining calories and display real-time progress toward the daily protein goal.
4.3 Verified Food Search via USDA API Integration
The application connects directly to the official United States Department of Agriculture (USDA) database, allowing users to type and search for standard consumer items. It instantly pulls verified nutritional breakdowns, ensuring users log scientifically precise values for calories, protein, carbohydrates, and fats.
 
<img width="565" height="286" alt="image" src="https://github.com/user-attachments/assets/31979211-f5e1-4d44-bd42-5612fb20aab4" />
4.4 Custom Food Logging Engine
To accommodate unique home-cooked meals or items missing from public databases, this feature allows users to manually type and log custom food entries. It provides maximum flexibility by ensuring users can override database search restrictions and accurately account for every calorie consumed.
<img width="479" height="439" alt="image" src="https://github.com/user-attachments/assets/098573f2-7f64-444d-b690-b170d6d7f52a" />
4.5 Deep-Dive Nutrition Inspector Panel
When any food item is selected from the logged list, this dedicated side panel dynamically populates to display an isolated, macro-level inspection of the food. It breaks the item down into clear standalone modules for Calories, Protein, Carbohydrates, and Total Fats, allowing users to understand exactly where their macros are coming from.
<img width="476" height="440" alt="image" src="https://github.com/user-attachments/assets/edfcead8-63ac-4536-a655-19a083ccb835" />
4.6 Weight Target and 30-Day Trend Analytics
This analytical feature lets users regularly update their current body mass via a "Set Weight Target" input box. The system captures these entries over time and renders a dynamic, responsive line graph that visualizes the user’s weight trend across a rolling 30-day window to track fitness progress.
<img width="568" height="188" alt="image" src="https://github.com/user-attachments/assets/3c2dcdb5-4493-4571-a8a7-2a1bb2f5f279" />
4.7 Intelligent 'Ask AI' Assistant via Google Gemini API
The "Ask AI" panel embeds an interactive chatbot powered by the Google Gemini API directly into the user interface. It serves as an on-demand virtual nutritionist, letting users ask natural language questions about meal prepping, dietary alternatives, and general health advice instantly.

Chapter 5: Technology Stack
To ensure a highly responsive, scalable, and maintainable application, the Food Logger (Diet+) project utilizes a modern MERN-stack architecture (MongoDB, Express, React, Node.js) combined with powerful third-party API integrations.
5.1 Frontend Development
The user interface is built as a Single Page Application (SPA) to provide a seamless, app-like experience in the browser without page reloads.
•	React.js & JavaScript (ES6+): Serves as the core frontend library for building the interactive component-based user interface.
•	Tailwind CSS: A utility-first CSS framework used to rapidly style the application, ensuring a clean, modern, and fully responsive design across all devices.
•	React Router DOM: Manages dynamic client-side routing, allowing users to smoothly navigate between the Dashboard, Profile, and Ask AI tabs.
•	React Hook Form: Utilized for efficient, performant form validation and state management during user registration and custom food entry logging.
5.2 Backend Development
The server-side logic is designed to be lightweight, fast, and capable of handling RESTful API requests efficiently.
•	Node.js: The JavaScript runtime environment that executes backend code asynchronously, providing high performance for data-heavy tracking applications.
•	Express.js: A robust web application framework for Node.js, used to construct the backend routing architecture, handle HTTP POST/GET requests from the frontend, and manage user session cookies.
5.3 Database Management
The application requires a flexible, document-based database to store complex, nested daily logs and individual user targets.
•	MongoDB: A NoSQL database chosen for its ability to seamlessly store dynamic JSON-like documents, perfect for the nested array structure of daily meal logging (breakfast, lunch, dinner, snacks).
•	Mongoose ODM: An Object Data Modeling library used to enforce strict schema validation (e.g., ensuring caloric and macronutrient values are always saved as numbers) and simplify database queries.
5.4 Third-Party APIs
To elevate the application's functionality beyond standard CRUD (Create, Read, Update, Delete) operations, two major external APIs are integrated:
•	USDA National Nutrient Database API: Connects the application to official United States government data, allowing users to search for generic foods and retrieve scientifically verified macro-nutrient profiles instantly.
•	Google Gemini API: Powers the "Ask AI" feature, utilizing advanced natural language processing to provide users with an intelligent, on-demand virtual nutritionist for dietary advice and meal planning.


 Chapter 6: Project Screenshots ( Proof of work)

Hero section:
<img width="940" height="444" alt="image" src="https://github.com/user-attachments/assets/f721ebc1-dcd1-4b8d-bc69-85f05cbe2ce5" />
sign up page:
<img width="940" height="449" alt="image" src="https://github.com/user-attachments/assets/db81773e-a19a-4758-a5d3-ffc370a71640" />
Dashboard page:Dashboard page:
<img width="940" height="446" alt="image" src="https://github.com/user-attachments/assets/5f55fe66-cfca-4be5-887a-8569840b1ef7" />
Ask AI page:
<img width="940" height="448" alt="image" src="https://github.com/user-attachments/assets/9a409c68-66f8-41ec-b24a-15b28e2d3fcf" />
Chapter 7: Open Source Repository:

Github Link:  https://github.com/AquibAli-true/final-project-2ndYear
Vercel Link:   https://final-project-2nd-year-1ro9.vercel.app
Render Link: https://final-project-2ndyear.onrender.com


Chapter 8: Future Scope
The current implementation of Diet+ establishes a robust foundation for automated dietary logging, real-time macro visualization, and intelligent AI interaction. However, to maximize its impact on public health and align closer with the long-term goals of SDG 3, several key enhancements, feature expansions, and advanced technologies are proposed for future iterations.
8.1 Advanced Nutritional Inspector and Micronutrient Tracking
While the current inspector panel successfully isolates key macronutrients (Calories, Protein, Carbohydrates, and Fats), future updates will expand this module to offer granular biochemical breakdowns. The enhanced inspector will track:
•	Micronutrients: Comprehensive logging of essential vitamins (A, C, D, E, K, B-complex) and minerals (Iron, Calcium, Zinc, Potassium, Magnesium, Sodium).
•	Dietary Quality Markers: Isolation of dietary fiber, sugar content types (added vs. natural), and fatty acid profiles (saturated, unsaturated, and trans fats).
•	Allergen and Dietary Restriction Alerts: Automated flags warning users of allergens (e.g., gluten, nuts, dairy) or dietary mismatches (e.g., non-vegan ingredients) during the food selection phase.
8.2 Barcode Scanning Integration via Open Food Facts API
To significantly reduce tracking friction and completely eliminate manual data entry for packaged goods, a barcode scanning module will be introduced.
•	Hardware Utilization: The system will leverage the device's native camera directly through the web browser or mobile wrapper to instantly decode standard UPC/EAN barcodes.
•	Open Food Facts API Integration: Decoded barcodes will instantly query the open-source Open Food Facts database, a crowdsourced global repository containing millions of food products. This will pull exact commercial product names, brands, nutritional scores (Nutri-Score), and precise macro profiles, making grocery logging instantaneous.








