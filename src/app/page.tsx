"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [advocates, setAdvocates] = useState<any[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<any[]>([]);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    document.getElementById("search-term")!.innerHTML = searchTerm;

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.specialties.some((specialty: string) => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        advocate.yearsOfExperience.toString().toLowerCase().includes(searchTerm.toLowerCase())  ||
        advocate.phoneNumber.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onResetClick = () => {
    document.getElementById("search-term")!.innerHTML = "";
    document.querySelector("input")!.value = "";

    setFilteredAdvocates(advocates);
  };

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Solace Advocates</h1>
      
      <div className="mb-8">
        <p className="text-lg font-medium text-gray-700 mb-2">Search</p>
        <p className="text-sm text-gray-600 mb-4">
          Searching for: <span id="search-term" className="font-semibold text-blue-600"></span>
        </p>
        <div className="flex gap-4 items-center">
          <input 
            className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Search advocates..."
            onChange={onChange} 
          />
          <button 
            onClick={onResetClick}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Reset Search
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degree</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialties</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Years of Experience</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAdvocates.map((advocate: any, index: number) => {
              return (
                <tr key={`${advocate.firstName}-${advocate.lastName}-${index}`} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{advocate.firstName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{advocate.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{advocate.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{advocate.degree}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {advocate.specialties.map((s: any, index: number) => (
                        <span 
                          key={`${s}-${index}`}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{advocate.yearsOfExperience}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {advocate.phoneNumber.toString().replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredAdvocates.map((advocate: any, index: number) => {
          return (
            <div key={`${advocate.firstName}-${advocate.lastName}-${index}`} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="flex flex-col space-y-3">
                {/* Name and Basic Info */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {advocate.firstName} {advocate.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{advocate.degree}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {advocate.yearsOfExperience} years exp.
                    </p>
                    <p className="text-sm text-gray-600">{advocate.city}</p>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Specialties</p>
                  <div className="flex flex-wrap gap-1">
                    {advocate.specialties.map((s: any, index: number) => (
                      <span 
                        key={`${s}-${index}`}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Phone Number */}
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {advocate.phoneNumber.toString().replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
