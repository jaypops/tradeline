import { Button } from "@/components/ui/button";
import FormUser from "@/components/users/add-user/FormUser";

export default function AddUserPage() {
  return (
    <div>
      <div className="flex justify-end ">
        <Button className="bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer">
          Generate Link
        </Button>
      </div>
      <div className="py-4">
        <FormUser />
      </div>
    </div>
  );
}
