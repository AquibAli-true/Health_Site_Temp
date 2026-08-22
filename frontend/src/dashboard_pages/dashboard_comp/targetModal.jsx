import { useForm } from "react-hook-form";

const TargetModal = ({ isOpen, setIsOpen, setChangedBarData, currentDate }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/dashboard/set-target`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            currentDate,
          }),
          credentials: "include",
        },
      );
      if (response.ok) {
        setChangedBarData((prev) => prev + 1);
      }
    } catch (e) {
      console.log(e);
    }
    setIsOpen(false);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#f0f5f2] shadow-[0_0_15px_rgba(0,0,0,0.10)] shadow-[#A0BFAC] flex items-center justify-center bg-black/50 px-3">
      <div className="w-[90%] max-w-sm sm:w-[85%] sm:max-w-md rounded-xl bg-white p-4 sm:p-6 shadow-xl">
        <h2 className="mb-5 sm:mb-6 text-xl sm:text-2xl font-inter font-semibold">
          Set Daily Targets
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          <div>
            <label className="mb-1 font-poppins text-gray-700 block text-xs sm:text-sm font-medium">
              Calories(kcal)
            </label>

            <input
              type="number"
              {...register("calories", {
                required: "Calories is required",
                min: {
                  value: 1,
                  message: "Must be greater than 0",
                },
              })}
              className="w-full font-nunito focus:outline-0 focus:border-[#10b981] focus:ring-0 rounded-lg border px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base outline-none"
              placeholder="e.g. 2000"
            />

            {errors.calories && (
              <p className="mt-1 text-xs sm:text-sm text-red-500">
                {errors.calories.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 text-gray-700 font-poppins block text-xs sm:text-sm font-medium">
              Proteins (g)
            </label>

            <input
              type="number"
              {...register("proteins", {
                required: "Proteins is required",
                min: {
                  value: 1,
                  message: "Must be greater than 0",
                },
              })}
              className="w-full font-nunito rounded-lg border focus:border-[#10b981] px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base outline-none focus:outline-0 focus:ring-0"
              placeholder="e.g. 150"
            />

            {errors.proteins && (
              <p className="mt-1 text-xs sm:text-sm text-red-500">
                {errors.proteins.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 text-gray-700 font-poppins block text-xs sm:text-sm font-medium">
              Fats (g)
            </label>

            <input
              type="number"
              {...register("fats", {
                required: "Fats is required",
                min: {
                  value: 1,
                  message: "Must be greater than 0",
                },
              })}
              className="w-full font-nunito focus:outline-0 focus:border-[#10b981] focus:ring-0 rounded-lg border px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base outline-none"
              placeholder="e.g. 60"
            />

            {errors.fats && (
              <p className="mt-1 text-xs sm:text-sm text-red-500">
                {errors.fats.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 text-gray-700 font-poppins block text-xs sm:text-sm font-medium">
              Carbs (g)
            </label>

            <input
              type="number"
              {...register("carbs", {
                required: "Carbs is required",
                min: {
                  value: 1,
                  message: "Must be greater than 0",
                },
              })}
              className="w-full font-nunito focus:outline-0 focus:border-[#10b981] focus:ring-0 rounded-lg border px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base outline-none"
              placeholder="e.g. 250"
            />

            {errors.carbs && (
              <p className="mt-1 text-xs sm:text-sm text-red-500">
                {errors.carbs.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 sm:gap-3 pt-2 sm:pt-4">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                reset();
              }}
              className="rounded-lg border text-white cursor-pointer bg-red-500 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base cursor-pointer font-poppins bg-(--accent-emerald) text-white"
            >
              Set Target
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TargetModal;