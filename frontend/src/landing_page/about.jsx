

const About = () => {
  return (
    <>
    <div className="flex h-screen md:p-20 sm:p-10 p-7 flex-col gap-10">
        <h1 className="text-4xl tracking-widest font-semibold text-(--global-dark-theme) font-poppins">About Us</h1>
        <div className="p-5 border border-(--global-dark-theme)/60 rounded-xl bg-white font-inter text-left"><p>At Diet Plus, we believe that better health starts with better information. Our mission is to make nutrition and wellness simple, accessible, and actionable for everyone.</p>
        <p>Our platform helps you understand what you eat and how it impacts your health. Whether you're working toward weight loss, muscle gain, maintaining a balanced diet, or simply building healthier habits, we provide the tools you need to make informed decisions.</p>
        <p className="mt-4">With HealthTrack, you can:</p>
        <ul className="list-disc pl-5 mt-2 mb-4 space-y-1">
          <li>Track your daily calorie intake and monitor your nutritional goals.</li>
          <li>Get personalized meal suggestions based on your dietary preferences and health objectives.</li>
          <li>Build healthier eating habits through accurate, data-driven insights.</li>
        </ul>
        <p>We are committed to providing reliable nutritional information in a clean, user-friendly experience. Our goal is not to tell you what to eat, but to empower you with the knowledge needed to make choices that align with your personal health goals.</p>
        <p className="mt-4" >Your journey toward a healthier lifestyle is unique, and we're here to support it every step of the way.</p>
        </div>
    </div>
    </>
  )
}

export default About