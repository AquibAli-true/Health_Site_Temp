

const NutritionCardA = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="bg-[#FF6B35] rounded-[2rem] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 text-white">
        
        <div className="flex-1 space-y-4 md:space-y-6 text-left lg:text-left max-w-xl">
          <h2 className="text-3xl font-poppins text-(--global-dark-theme) md:text-5xl font-semibold tracking-tight">
            Dial up your diet
          </h2>
          <p className="font-lato  text-(--global-dark-theme)/70 text-md md:text-xl leading-relaxed">
            See which of the essential vitamins and minerals you're getting the most and least of, 
            helping you eat a more balanced diet. Track up to 95 different nutrients and compounds.
          </p>
        </div>

        <div className="flex-1 w-full max-w-md lg:max-w-xl">
          <img 
            src="https://media.post.rvohealth.io/wp-content/uploads/sites/5/2024/02/Bezzy-salmon-dinner-1520x855-header.jpg" 
            alt="Nutrition chart and meal preview" 
            className="w-full h-auto object-contain rounded-2xl"
          />
        </div>

      </div>
    </div>
  );
};

export default NutritionCardA;