import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Role } from "@/types";

// Define a partial role type for the badge
type PartialRole = Pick<Role, 'id' | 'name'>;

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        admin: "border-transparent bg-red-500 text-white hover:bg-red-500/80",
        editor: "border-transparent bg-blue-500 text-white hover:bg-blue-500/80",
        user: "border-transparent bg-green-500 text-white hover:bg-green-500/80",
        custom: "border-transparent bg-purple-500 text-white hover:bg-purple-500/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeRoleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'>,
    VariantProps<typeof badgeVariants> {
  role: PartialRole;
}

export function BadgeRole({
  className,
  variant,
  role,
  ...props
}: BadgeRoleProps) {
  // Determine the variant based on the role name
  const roleVariant =
    role.name.toLowerCase() === "admin" ? "admin" :
    role.name.toLowerCase() === "editor" ? "editor" :
    role.name.toLowerCase() === "user" ? "user" : "custom";

  return (
    <div
      className={cn(badgeVariants({ variant: variant || roleVariant }), className)}
      {...props}
    >
      {role.name}
    </div>
  );
}
