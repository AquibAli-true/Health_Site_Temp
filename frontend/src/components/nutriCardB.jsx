const NutritionCardB = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="bg-[#1CCAD7] rounded-[2rem] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 text-white">
        
        <div className="flex-1 space-y-4 md:space-y-6 text-left lg:text-left max-w-xl">
          <h2 className="text-3xl font-poppins text-(--global-dark-theme) md:text-5xl font-semibold tracking-tight">
            Reach & maintain your goal weight
          </h2>
          <p className="font-lato  text-(--global-dark-theme)/70 text-md md:text-xl leading-relaxed">
            Monitor your food intake with detailed food journaling, verified nutrition information, and a built-in nutritional target wizard to keep yourself accountable. 
          </p>
        </div>

        <div className="flex-1 w-full max-w-md lg:max-w-xl">
          <img 
            src="https://paleoleap.com/wp-content/uploads/2018/02/Goal-Weight.jpg" 
            alt="Nutrition chart and meal preview" 
            className="w-full h-auto object-contain rounded-2xl"
          />
        </div>

      </div>
    </div>
  );
};

export default NutritionCardB;