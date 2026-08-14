import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [userDetails, setUserDetails] = useState([
    { id: 'name', label: 'Name', value: '' },
    { id: 'email', label: 'Email', value: '' },
    { id: 'age', label: 'Age', value: '' },
    { id: 'height', label: 'Height (cm)', value: '' },
    { id: 'weight', label: 'Weight (kg)', value: '' },
    { id: 'sex', label: 'Sex', value: '' },
  ]);

  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    const handleProfile = async () => {
      
        const response = await fetch(import.meta.env.VITE_SERVER  + "/user-data", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
        const res = await response.json();
        console.log(res);
        console.log("show me")
        if (response.ok && res.user) {
          setUserDetails([
            { id: 'name', label: 'Name', value: res.user.name || '' },
            { id: 'email', label: 'Email', value: res.user.email || '' },
            { id: 'age', label: 'Age', value: res.user.age || '' },
            { id: 'height', label: 'Height (cm)', value: res.user.height || '' },
            { id: 'weight', label: 'Weight (kg)', value: res.user.weight || '' },
            { id: 'sex', label: 'Sex', value: res.user.sex || '' },
          ]);
        }
      
    };
    handleProfile();
  }, []);

  const handleInputChange = (id, newValue) => {
    setUserDetails(prev => prev.map(item => item.id === id ? { ...item, value: newValue } : item));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_SERVER  + "/update-profile", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userDetails.find(item => item.id === 'name').value,
          age: Number(userDetails.find(item => item.id === 'age').value),
          sex: userDetails.find(item => item.id === 'sex').value,
          weight: Number(userDetails.find(item => item.id === 'weight').value),
          height: Number(userDetails.find(item => item.id === 'height').value)
        })
      });
      if (response.ok) console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const toggleEdit = async (id) => {
    if (editingId === id) {
      await handleUpdate();
      setEditingId(null);
    } else {
      setEditingId(id);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_SERVER  + '/log-out', { method: 'POST', credentials: 'include' });
      if (response.ok) navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="h-screen w-full bg-(--off-white) overflow-y-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold text-(--global-dark-theme) font-poppins mb-10">Profile</h1>

        <div className="flex flex-col gap-6">
          {userDetails.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-[#E4E5F1] rounded-2xl border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-16 flex-1 mb-4 sm:mb-0">
                <span className="text-(--global-dark-theme) font-poppins font-medium w-32 uppercase text-sm">
                  {item.label}
                </span>
                
                {editingId === item.id ? (
                  <input
                    type={item.id === 'age' || item.id === 'weight' || item.id === 'height' ? 'number' : 'text'}
                    value={item.value}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    className="bg-transparent text-(--global-dark-theme) font-medium text-lg border-b border-(--off-white) outline-none w-full sm:w-64"
                    autoFocus
                  />
                ) : (
                  <span className="text-(--global-dark-theme) font-medium text-lg">{item.value}</span>
                )}
              </div>

              <button 
                onClick={() => toggleEdit(item.id)}
                className={`px-8 py-2.5 cursor-pointer rounded-full border transition-all duration-300 font-poppins font-medium text-sm w-full sm:w-auto
                  ${editingId === item.id 
                    ? 'bg-(--off-white) text-(--global-dark-theme)' 
                    : 'bg-(--global-dark-theme)/75 border-(--off-white) text-(--off-white) hover:bg-(--off-white) hover:text-(--global-dark-theme)'}`}
              >
                {editingId === item.id ? 'Save' : 'Update'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 pb-20">
          <button onClick={handleLogout} className="px-8 py-3 bg-red-500/10 border border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 font-poppins font-medium">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}