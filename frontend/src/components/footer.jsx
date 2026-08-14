

const Footer = () => {
  return (
    <footer className="w-full bg-(--global-dark-theme) text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16 flex flex-col sm:flex-row items-center justify-between gap-4">
        

        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <a className="flex items-center justify-center sm:justify-start">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="ml-3 text-(--off-white) font-arizonia text-xl">Diet+</span>
          </a>

          <p className="text-sm font-lato text-(--off-white)/70 sm:border-l-2 sm:border-gray-700 sm:pl-4 sm:py-2">
            © 2026 DietPlus — <span className="text-(--off-white)/70 font-lato ml-1">aqibali4906@gmail.com</span>
          </p>
        </div>


        <div className="flex items-center  gap-4">
          <a 
            href="https://github.com/AquibAli-true" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-white  transition-colors"
          >
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 cursor-pointer h-5">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.0.069-.608 1 .07 1.523 1.03 1.523 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          <a 
            href="https://www.linkedin.com/in/aquib-ali-438434349/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-white  transition-colors"
          >
            <svg fill="currentColor" className="w-5 cursor-pointer h-5" viewBox="0 0 24 24">
              <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
              <circle cx="4" cy="4" r="2" stroke="none"></circle>
            </svg>
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;