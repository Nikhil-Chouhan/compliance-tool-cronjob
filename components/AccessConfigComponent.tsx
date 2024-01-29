import React, { useEffect, useState } from "react";
import { BsCardList } from "react-icons/bs";
import Link from "next/link";

export default function AccessConfigComponent() {
  const [roles, setRoles] = useState<string[]>([]);
  const permissions = ["Add", "Edit", "View", "Delete", "Download"];

  useEffect(() => {
    fetch(`/api/role?page=&pageSize=-1&filterName=`)
      .then((response) => response.json())
      .then((data) => {
        const entrylist = data["roleList"];
        const rolesArray = entrylist.map((entry) => entry.name);
        setRoles(rolesArray);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {});
  }, []);

  const [rolePermissions, setRolePermissions] = useState<{
    [key: string]: string[];
  }>({});

  const handleCheckboxChange = (role: string, permission: string) => {
    setRolePermissions((prev) => {
      const updatedPermissions = { ...prev };
      if (!updatedPermissions[role]) {
        updatedPermissions[role] = [];
      }

      const index = updatedPermissions[role].indexOf(permission);
      if (index !== -1) {
        updatedPermissions[role] = [
          ...updatedPermissions[role].slice(0, index),
          ...updatedPermissions[role].slice(index + 1),
        ];
      } else {
        // Permission doesn't exist, add it
        updatedPermissions[role] = [...updatedPermissions[role], permission];
      }

      return updatedPermissions;
    });
  };

  if (roles.length === 0) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="card rounded-corner h-100 p-4 container">
      <h5 className="card-title">
        <BsCardList size={25} className="mx-2" />
        Access Control Configuration Page
      </h5>
      <br />
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Roles</th>
              {permissions.map((permission) => (
                <th className="text-center" key={permission}>
                  {permission}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role}>
                <td>{role}</td>
                {permissions.map((permission) => (
                  <td key={permission} className="text-center">
                    <div className="form-check d-flex justify-content-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        style={{ transform: "scale(1.2)" }}
                        checked={(rolePermissions[role] || []).includes(
                          permission
                        )}
                        onChange={() => handleCheckboxChange(role, permission)}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="col-md-12 text-end">
          <Link
            href="/role"
            className="btn btn-outline-dark btn-hover-none btn-active-none mx-1 text-decoration-none text-dark"
          >
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary light mx-2">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
