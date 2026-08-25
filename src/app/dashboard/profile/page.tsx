import { auth } from "@/auth";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PersonalInformation from "@/components/profile/PersonalInformation";

export default async function ProfilePage() {
  const session = await auth();

  return (
    <div className="space-y-8">
      <ProfileHeader user={session?.user} />

      <PersonalInformation user={session?.user} />
    </div>
  );
}