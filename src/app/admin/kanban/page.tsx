import { redirect } from "next/navigation";

/**
 * Legacy Kanban board route.
 * In accordance with offline artisan manual governance, automated date progression has been decommissioned.
 * All active orders and manual status updates are managed at /admin/orders.
 */
export default function WorkshopKanbanPage() {
  redirect("/admin/orders");
}
