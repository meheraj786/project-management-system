import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  User,
  Mail,
  Calendar,
  X,
  LampDesk,
  Hammer,
  Palette,
  Package,
  Megaphone,
  ShoppingCart,
  Users,
  Wallet,
  Cog,
} from "lucide-react";
import { AddMemberModal } from "../layouts/AddMemberModal";
import { useSelector } from "react-redux";
import { getDatabase, onValue, ref } from "firebase/database";
import CustomLoader from "../layouts/CustomLoader";

const Members = () => {
  const user = useSelector((state) => state.userInfo.value);
  const [loading, setLoading]= useState(true)
  const db = getDatabase();
  const [departments, setDepartments] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const starCountRef = ref(db, "users/");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const members = item.val();
        if (members.adminId == user?.uid) {
          arr.push({ ...members, id: item.key });
        }
      });
      setMembers(arr);
      setDepartments(() => {
        let departments = arr.map((m) => m.department);
        const set = new Set(departments);
        const department = [...set];
        return department;
      });
      setLoading(false)
    });
  }, []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "",
  });
  const departmentIcons = {
    Engineering: <Hammer className="w-4 h-4 text-blue-500" />,
    Design: <Palette className="w-4 h-4 text-pink-500" />,
    Product: <Package className="w-4 h-4 text-yellow-500" />,
    Marketing: <Megaphone className="w-4 h-4 text-red-500" />,
    Sales: <ShoppingCart className="w-4 h-4 text-green-500" />,
    HR: <Users className="w-4 h-4 text-purple-500" />,
    Finance: <Wallet className="w-4 h-4 text-indigo-500" />,
    Operations: <Cog className="w-4 h-4 text-gray-600" />,
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const removeMember = (id) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  if (loading) return <CustomLoader/>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {showAddModal && (
        <AddMemberModal onClose={() => setShowAddModal(false)} />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Team Members
              </h1>
              <p className="text-gray-600">
                Manage your team members and their roles
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Total Members
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {members.length}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Active Members
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {members.filter((m) => m.status === "Active").length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Departments
                  </p>
                  <div className="flex items-center gap-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {departments.length}
                    </p>
                    <div className="flex gap-1">
                      {Object.keys(departmentIcons).map(
                        (dep) =>
                          departments.includes(dep) && (
                            <span
                              className="text-sm rounded-full bg-gray-50"
                              key={dep}
                            >
                              {departmentIcons[dep]}
                            </span>
                          )
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <div className="w-6 h-6 bg-primary rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 ${member.color} rounded-full flex items-center justify-center overflow-hidden`}
                >
                  <img
                    src={member.profileImage}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <div className="relative">
                  <div className="absolute right-0 top-full mt-1 opacity-0 group-hover:opacity-100 bg-white shadow-lg border border-gray-200 rounded-lg py-1 min-w-32 z-10 transition-opacity">
                    <button
                      onClick={() => removeMember(member.id)}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Remove Member
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {member.name}
                  </h3>
                  <p className="text-primary text-sm font-medium">
                    {member.role}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{member.email}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {member.joinDate}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  {departmentIcons[member.department] || (
                    <Cog className="w-4 h-4 text-gray-400" />
                  )}
                  <span>{member.department}</span>
                </div>

                {/* <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">{member.status}</span>
                </div> */}
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No members found
            </h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Add Member Modal */}
        {/* {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Member</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <input
                    type="text"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    placeholder="Enter role/position"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addMember}
                  disabled={!newMember.name || !newMember.email || !newMember.role}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/80 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Members;
