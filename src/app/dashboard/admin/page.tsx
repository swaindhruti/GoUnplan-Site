"use client";

import { getAllUsers } from "@/actions/admin/action";
import { useState, useEffect } from "react";

interface Host {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  role: string;
}

export default function AdminDashboard() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers();
        if (response.error) {
          console.error("Failed to fetch hosts:", response.error);
          setHosts([]); // Set empty array on error
        } else if (response?.users) {
          setHosts(response.users);
        } else {
          console.error("No hosts found in response");
          setHosts([]); // Set empty array when no users
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setHosts([]); // Set empty array on exception
      } finally {
        setLoading(false);
      }
    };
    fetchHosts();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <h2 className="text-2xl mb-4">Users List</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Created At</th>
            </tr>
          </thead>
          <tbody>
            {hosts.length > 0 ? (
              hosts.map((host) => (
                <tr key={host.id}>
                  <td className="px-4 py-2 border text-center">{host.id}</td>
                  <td className="px-4 py-2 border text-center">{host.role}</td>
                  <td className="px-4 py-2 border text-center">{host.name}</td>
                  <td className="px-4 py-2 border text-center">{host.email}</td>
                  <td className="px-4 py-2 border text-center">{host.phone}</td>
                  <td className="px-4 py-2 border text-center">
                    {new Date(host.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-2 border text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
