"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  BsFolder,
  BsBarChartLine,
  BsGraphUp,
  BsFiletypeDoc,
  BsFileEarmarkMedical,
  BsCalendar2Week,
  BsUiChecks,
  BsCardChecklist,
  BsClipboardCheck,
  BsFolder2Open,
  BsPersonGear,
  BsPersonLock,
  BsUiChecksGrid,
  BsUiRadios,
  BsPersonUp,
  BsBuildingAdd,
  BsPersonBadge,
  BsDiagram3,
  BsTextIndentLeft,
  BsPeople,
  BsFileEarmarkArrowDown,
  BsLayoutWtf,
  BsSkipStart,
  BsSkipEnd,
  BsBuildings,
  BsDiagram2,
  BsJournalMedical,
  BsViewStacked,
  BsUiRadiosGrid,
  BsFillPersonFill,
  BsDownload,
  BsPersonAdd,
  BsGear,
  BsToggles2,
  BsFillPaletteFill,
  BsChatLeftQuoteFill,
} from "react-icons/bs";
import { sidebarAtom } from "@/atoms/sidebar";
import { useAtom } from "jotai";
import { usePathname } from "next/navigation";

export default function SidebarMenu() {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarShown, setSidebarShown] = useAtom(sidebarAtom);
  const pathname = usePathname();
  const analyticsMenu = [
    {
      name: "Dashboard",
      url: "/",
      icon: <BsBarChartLine className="mx-2 mb-1" />,
    },
    {
      name: "Compliance Report",
      url: "/compliance-report",
      icon: <BsFiletypeDoc className="mx-2 mb-1" />,
    },
    {
      name: "Compliance Certificates",
      url: "/compliance-certificates",
      icon: <BsFileEarmarkMedical className="mx-2 mb-1" />,
    },
  ];

  const mainUpMenu = [
    {
      name: "Repository",
      url: "/repository",
      icon: <BsFolder size={20} className="mx-2 mb-1" />,
    },
    {
      name: "Compliance Calender",
      url: "/compliance-calender",
      icon: <BsCalendar2Week size={20} className="mx-2 mb-1" />,
    },
  ];

  const mainDownMenu = [
    {
      name: "Notice Management",
      url: "/notice-management",
      icon: <BsClipboardCheck size={20} className="mx-2 mb-1" />,
    },
    {
      name: "Documents & Records",
      url: "/documents-and-records",
      icon: <BsFolder2Open size={20} className="mx-2 mb-1" />,
    },
    {
      name: "Support",
      url: "/support",
      icon: <BsPersonGear size={20} className="mx-2 mb-1" />,
    },
  ];

  const activityMappingMenu = [
    {
      name: "Imported Activity",
      url: "/activity_mapping/imported_activity",
      icon: <BsClipboardCheck className="mx-2 mb-1" />,
    },
    {
      name: "Assign Activity",
      url: "/activity_mapping/assign_activity",
      icon: <BsPersonAdd className="mx-2 mb-1" />,
    },
    {
      name: "Activity Configuration",
      url: "/activity_mapping/activity_configuration",
      icon: <BsGear className="mx-2 mb-1" />,
    },
    {
      name: "Activate Activity",
      url: "/activity_mapping/activate_activity",
      icon: <BsToggles2 className="mx-2 mb-1" />,
    },
  ];

  const adminMenu = [
    {
      name: "Unit Function Mapping",
      url: "/unit_function_mapping",
      icon: <BsDiagram3 className="mx-2 mb-1" />,
    },
    {
      name: "User",
      url: "/user",
      icon: <BsPeople className="mx-2 mb-1" />,
    },
    // {
    //   name: "Export Data",
    //   url: "/export-data",
    //   icon: <BsFileEarmarkArrowDown className="mx-2 mb-1" />,
    // },
  ];

  const masterMenu = [
    {
      name: "Profile",
      url: "/org-profile",
      icon: <BsLayoutWtf className="mx-2 mb-1" />,
    },
    {
      name: "Organization",
      url: "/organization",
      icon: <BsBuildings className="mx-2 mb-1" />,
    },
    {
      name: "Entity",
      url: "/entity",
      icon: <BsBuildingAdd className="mx-2 mb-1" />,
    },
    {
      name: "Business Vertical",
      url: "/business_vertical",
      icon: <BsDiagram2 className="mx-2 mb-1" />,
    },
    {
      name: "Zone",
      url: "/zone",
      icon: <BsViewStacked className="mx-2 mb-1" />,
    },
    {
      name: "Business Unit",
      url: "/business_unit",
      icon: <BsPersonUp className="mx-2 mb-1" />,
    },
    {
      name: "Function",
      url: "/function",
      icon: <BsTextIndentLeft className="mx-2 mb-1" />,
    },
    {
      name: "Industry",
      url: "/industry",
      icon: <BsBuildings className="mx-2 mb-1" />,
    },
    {
      name: "Unit Type",
      url: "/unit_type",
      icon: <BsBuildings className="mx-2 mb-1" />,
    },
    {
      name: "Designations",
      url: "/designation",
      icon: <BsPersonBadge className="mx-2 mb-1" />,
    },
    {
      name: "Role",
      url: "/role",
      icon: <BsFillPersonFill className="mx-2 mb-1" />,
    },
    // {
    //   name: "Access Control",
    //   url: "/access-control",
    //   icon: <BsGear className="mx-2 mb-1" />,
    // },
    {
      name: "Theme",
      url: "/theme",
      icon: <BsFillPaletteFill className="mx-2 mb-1" />,
    },
    {
      name: "Comments",
      url: "/standard_comment",
      icon: <BsChatLeftQuoteFill  className="mx-2 mb-1" />,
    },
  ];


  const auditMenu = [
    {
      name: "DashBoard",
      url: "/audit-management/dashboard",
      icon: <BsBarChartLine className="mx-2 mb-1" />,
    },
    {
      name: "Checkpoint Completion",
      url: "/audit-management/checkpoint-completion",
      icon: <BsCardChecklist className="mx-2 mb-1" />,
    },
    {
      name: "Auditing",
      url: "/audit-management/auditing",
      icon: <BsUiChecksGrid className="mx-2 mb-1" />,
    },
    {
      name: "Reports",
      url: "/audit-management/reports",
      icon: <BsFiletypeDoc className="mx-2 mb-1" />,
    },
    {
      name: "Admin",
      url: "/audit-management/audit-admin",
      icon: <BsPersonLock className="mx-2 mb-1" />,
    },
  ];

  return (
    <>
      <div className="h-100 position-fixed " style={{ display: "flex" }}>
        <Sidebar className="align-items-center" collapsed={collapsed}>
          <Menu
            className="css-dip3t9 align-items-center"
            menuItemStyles={{
              button: ({ active }) => {
                return {
                  color: active ? "rgb(37 99 235 )" : "#444444",
                  backgroundColor: active
                    ? "rgb(219 234 254)"
                    : "rgb(255 255 255)",
                };
              },
            }}
          >
            <MenuItem
              onClick={() => {
                setCollapsed(!collapsed);
                setSidebarShown(!sidebarShown);
              }}
              className="rounded-md "
            >
              {sidebarShown ? (
                <BsSkipStart
                  size={25}
                  className="me-8 sb-button mx-2"
                  role="button"
                />
              ) : (
                <BsSkipEnd
                  size={25}
                  className="me-8 sb-button mx-2"
                  role="button"
                />
              )}
            </MenuItem>

            <SubMenu
              icon={<BsGraphUp size={20} className="mx-2 mb-1" />}
              label="Analytics"
            >
              {analyticsMenu.map((item, index) => (
                <MenuItem
                  key={index}
                  component={<Link href={item.url} />}
                  icon={item.icon}
                  active={pathname === item.url ? true : false}
                >
                  {item.name}
                </MenuItem>
              ))}
            </SubMenu>

            {mainUpMenu.map((item, index) => (
              <MenuItem
                key={index}
                component={<Link href={item.url} />}
                active={pathname === item.url ? true : false}
                icon={item.icon}
                className="rounded-md"
              >
                {item.name}
              </MenuItem>
            ))}

            <SubMenu
              icon={<BsUiChecks size={20} className="mx-2 mb-1" />}
              label="Audit Management"
            >
              {auditMenu.map((item, index) => (
                <MenuItem
                  key={index}
                  component={<Link href={item.url} />}
                  icon={item.icon}
                  active={pathname === item.url ? true : false}
                >
                  {item.name}
                </MenuItem>
              ))}
            </SubMenu>

            {mainDownMenu.map((item, index) => (
              <MenuItem
                key={index}
                component={<Link href={item.url} />}
                active={pathname === item.url ? true : false}
                icon={item.icon}
                className="rounded-md"
              >
                {item.name}
              </MenuItem>
            ))}

            <SubMenu icon={<BsUiRadios className="mx-2 mb-1" />} label="Admin">
              <SubMenu
                icon={<BsUiRadiosGrid className="mx-2 mb-1" />}
                label="Activity Mapping"
              >
                {activityMappingMenu.map((item, index) => (
                  <MenuItem
                    key={index}
                    component={<Link href={item.url} />}
                    icon={item.icon}
                    active={pathname === item.url ? true : false}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </SubMenu>

              <SubMenu
                icon={<BsJournalMedical className="mx-2 mb-1" />}
                label="Masters"
              >
                {masterMenu.map((item, index) => (
                  <MenuItem
                    key={index}
                    component={<Link href={item.url} />}
                    icon={item.icon}
                    active={pathname === item.url ? true : false}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </SubMenu>

              {adminMenu.map((item, index) => (
                <MenuItem
                  key={index}
                  component={<Link href={item.url} />}
                  icon={item.icon}
                  active={pathname === item.url ? true : false}
                >
                  {item.name}
                </MenuItem>
              ))}
            </SubMenu>
          </Menu>
        </Sidebar>
      </div>
    </>
  );
}
