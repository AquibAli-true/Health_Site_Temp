import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const Navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const passwordValue = watch("password");
  const onSubmit = async (data) => {
    try {
      const response = await fetch(import.meta.env.VITE_SERVER + "/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        Navigate("/auth-otp");
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="lg:w-[60vw] xl:w-[40vw] 2xl:w-[35vw] sm:w-[70vw] w-[90vw] flex flex-col items-center py-10  rounded-2xl  mx-auto">
      <h1 className="text-3xl font-extrabold text-(--global-dark-theme) font-poppins tracking-[4px] py-5">
        Create Your Account
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" flex flex-col gap-5 items-center"
      >
        <div className=" flex flex-col gap-5 w-full bg-[#FFFFFF] border border-(--global-dark-theme)/30 p-10 rounded-xl justify-center">
          <div className="flex justify-between items-center">
            <label className="font-semibold font-inter text-(--global-dark-theme tracking-widest)">
              Name
            </label>
            <input
              className="border border-(--global-dark-theme) w-[60%] py-2 px-5 rounded-lg"
              type="text"
              {...register("name", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
              })}
            />
          </div>
          {errors.name && (
            <span className="text-red-500 mx-auto font-nunito text-sm">
              {errors.name.message}
            </span>
          )}

          <div className="flex justify-between items-center">
            <label className="font-semibold font-inter text-(--global-dark-theme tracking-widest)">
              Email
            </label>
            <input
              className="border border-(--global-dark-theme) w-[60%] py-2 px-5 rounded-lg"
              type="email"
              {...register("email", {
                required: "email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
          </div>
          {errors.email && (
            <span className="text-red-500 mx-auto font-nunito text-sm">
              {errors.email.message}
            </span>
          )}
          <div className="flex justify-between items-center">
            <label className="font-semibold font-inter text-(--global-dark-theme tracking-widest)">
              Password
            </label>
            <input
              className="border border-(--global-dark-theme) w-[60%] py-2 px-5 rounded-lg"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
          </div>
          {errors.password && (
            <span className="text-red-500 mx-auto font-nunito text-sm">
              {errors.password.message}
            </span>
          )}
          <div className="flex justify-between items-center">
            <label className="font-semibold font-inter text-(--global-dark-theme tracking-widest)">
              Confirm Password
            </label>
            <input
              className="border border-(--global-dark-theme) w-[60%] py-2 px-5 rounded-lg"
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === passwordValue || "Passwords do not match",
              })}
            />
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500 mx-auto font-nunito text-sm">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
        <div className=" flex flex-col gap-5 w-full bg-[#FFFFFF] border border-(--global-dark-theme)/30 p-10 rounded-xl justify-center">
          <div className="flex justify-between items-center">
            <label className="font-semibold font-inter text-(--global-dark-theme tracking-widest)">
              Sex
            </label>
            <select
              {...register("sex", { required: "Please select your sex" })}
            >
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          {errors.sex && (
            <span className="text-red-500 mx-auto font-nunito text-sm">
              {errors.sex.message}
            </span>
          )}
          <div className="flex justify-between items-center">
            <label className="font-semibold font-inter text-(--global-dark-theme tracking-widest)">
              Age
            </label>
            <input
              className="border border-(--global-dark-theme) w-[60%] py-2 px-5 rounded-lg"
              type="number"
              {...register("age", {
                required: "Age is required",
                min: { value: 0, message: "Age cannot be negative" },
                max: { value: 130, message: "Age cannot exceed 130" },
              })}
            />
          </div>
          {errors.age && (
            <span className="text-red-500 mx-auto font-nunito text-sm">
              {errors.age.message}
            </span>
          )}
          <div className="flex justify-between items-center">
            <label className="font-semibold font-inter text-(--global-dark-theme tracking-widest)">
              Height (cm)
            </label>
            <input
              className="border border-(--global-dark-theme) w-[60%] py-2 px-5 rounded-lg"
              type="number"
              {...register("height", {
                required: "Height is required",
                min: { value: 0, message: "Height cannot be negative" },
                max: { value: 250, message: "Height cannot exceed 250cm" },
              })}
            />
          </div>
          {errors.height && (
            <span className="text-red-500 mx-auto font-nunito text-sm">
              {errors.height.message}
            </span>
          )}
          <div className="flex justify-between items-center">
            <label className="font-semibold font-inter text-(--global-dark-theme tracking-widest)">
              Weight (kg)
            </label>
            <input
              className="border border-(--global-dark-theme) w-[60%] py-2 px-5 rounded-lg"
              type="number"
              {...register("weight", {
                required: "Weight is required",
                min: { value: 0, message: "Weight cannot be negative" },
                max: { value: 650, message: "Weight cannot exceed 650kg" },
              })}
            />
          </div>
          {errors.weight && (
            <span className="text-red-500 mx-auto font-nunito text-sm">
              {errors.weight.message}
            </span>
          )}
        </div>
        <button
          className="w-[50%] p-3 cursor-pointer bg-blue-400 rounded-2xl font-semibold tracking-widest"
          type="submit"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default SignUp;
