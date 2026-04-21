import SellersList from "./SellersList";
import type { User } from "@prisma/client";

/**
 * Sellers Component
 *
 * This component serves as the container for the Sellers & Staff management tab.
 * It currently wraps the client-side SellersList component and passes down users.
 */
export default function Sellers({ users }: { users: User[] }) {
  return <SellersList users={users} />;
}
