import { Role } from "@/types";

/**
 * Props for the UserRolesFilter component
 */
export interface RolesFilterProps {
  roles: Role[];
  selectedRoleIds: (number | string)[] | null;
  baseUrl: string;
}

/**
 * Extended filters for the users table
 */
export interface TableFilters {
  search: string;
  sort_field: string;
  sort_direction: "asc" | "desc";
  per_page: number;
  page: number;
  role_ids?: (number | string)[] | null;
}
