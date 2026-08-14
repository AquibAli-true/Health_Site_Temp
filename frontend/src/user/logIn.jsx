import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const Navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const response = await fetch(import.meta.env.VITE_SERVER + "/log-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        Navigate("/home");
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="lg:w-[60vw] h-screen xl:w-[40vw] 2xl:w-[35vw] sm:w-[70vw] w-[90vw] flex flex-col items-center py-10  rounded-2xl  mx-auto">
      <h1 className="text-3xl font-extrabold text-(--global-dark-theme) font-poppins tracking-[4px] py-5">
        Log In To Your Account
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" flex flex-col gap-5 items-center"
      >
        <div className=" flex flex-col gap-5 w-full bg-[#FFFFFF] border border-(--global-dark-theme)/30 p-10 rounded-xl justify-center">
          <div className="flex justify-between items-center">
            <label className="font-semibold font-inter text-(--global-dark-theme tracking-widest)">
              Email
            </label>
            <input
              className="border border-(--global-dark-theme) w-[60%] py-2 px-5 rounded-lg"
              type="email"
              {...register("email", {
                required: "Email is required",
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
        </div>
        <button
          className="w-[50%] p-3 cursor-pointer bg-blue-400 rounded-2xl font-semibold tracking-widest"
          type="submit"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default LogIn;
