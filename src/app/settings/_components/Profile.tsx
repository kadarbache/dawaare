"use client";

import {
  ChangeEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { authClient } from "@/lib/auth-client";
import {
  updateProfile,
  updatePassword,
  updateProfilePicture,
} from "../actions";
import { toast } from "react-hot-toast";
import { Loader2, CircleAlert, ShieldCheck } from "lucide-react";
import { uploadImage } from "@/lib/upload";
import Image from "next/image";
import { User as AuthUser } from "@/lib/auth";
import PhoneInput from "@/components/PhoneInput";

export default function Profile() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user as AuthUser;

  const [profileState, profileAction, profilePending] = useActionState(
    updateProfile,
    null,
  );
  const [passwordState, passwordAction, passwordPending] = useActionState(
    updatePassword,
    null,
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatar, setAvatar] = useState({
    url: "",
    id: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Split name using array methods
  useEffect(() => {
    if (user?.name) {
      const nameParts = user.name.trim().split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" "));
    }
    if (user?.image) {
      setAvatar({
        url: user.image,
        id: user.image_id,
      });
    }
    if (user?.number) {
      if (user.number.startsWith("+252 ")) {
        setPhoneNumber(user.number.replace("+252 ", ""));
      } else {
        setPhoneNumber(user.number);
      }
    }
  }, [user]);

  useEffect(() => {
    if (profileState?.status === "success") {
      toast.success("Profile updated successfully");
    } else if (profileState?.status === "error") {
      toast.error(profileState.message);
    }
  }, [profileState]);

  useEffect(() => {
    if (passwordState?.status === "success") {
      toast.success("Password changed successfully");
    } else if (passwordState?.status === "error") {
      toast.error(passwordState.message);
    }
  }, [passwordState]);

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const { url, publicId } = await uploadImage(file);
      setAvatar({
        url,
        id: publicId,
      });
      const res = await updateProfilePicture(url, publicId);
      if (res.status === "success") {
        toast.success("Avatar uploaded successfully");
      } else {
        toast.error(res.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to upload avatar");
      }
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (sessionLoading || !user) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Personal Information Section */}
      <section className="bg-white dark:bg-background-dark/50 rounded-md border border-slate-200 dark:border-primary/10 p-8 shadow-sm">
        <form action={profileAction}>
          {/* Hidden field for the image URL */}
          <input type="hidden" name="image" value={avatar.url} />

          <div className="flex flex-col md:flex-row gap-10">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-primary/30 flex items-center justify-center overflow-hidden relative">
                {avatar.url ? (
                  <Image
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                    src={avatar.url}
                    width={96}
                    height={96}
                  />
                ) : (
                  <span className="text-3xl text-slate-400 font-bold">
                    {firstName?.[0]?.toUpperCase()}
                  </span>
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleAvatarSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="px-4 py-1.5 border border-primary text-primary text-xs font-bold uppercase tracking-widest rounded-md hover:bg-primary/5 transition-colors disabled:opacity-50"
                >
                  Change Avatar
                </button>
                {avatar.url && (
                  <button
                    type="button"
                    onClick={() => setAvatar({ url: "", id: "" })}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Personal Info Grid */}
            <div className="flex-1">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6">
                Personal Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="profile-first-name"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400"
                  >
                    First Name
                  </label>
                  <input
                    id="profile-first-name"
                    name="firstName"
                    value={firstName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFirstName(e.target.value)
                    }
                    className="w-full bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
                    type="text"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="profile-last-name"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400"
                  >
                    Last Name
                  </label>
                  <input
                    id="profile-last-name"
                    name="lastName"
                    value={lastName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setLastName(e.target.value)
                    }
                    className="w-full bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="profile-email"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="profile-email"
                      name="email"
                      defaultValue={user.email}
                      className="w-full bg-slate-100/50 dark:bg-slate-900/20 border border-slate-200 dark:border-primary/10 rounded-md px-4 py-2.5 text-slate-500 dark:text-slate-400 cursor-not-allowed pr-24 outline-none"
                      type="email"
                      readOnly
                      title="Email cannot be changed directly"
                    />
                    {user.emailVerified ? (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        Verified
                      </span>
                    ) : (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        Unverified
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="profile-phone"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400"
                  >
                    Phone Number
                  </label>
                  <PhoneInput
                    id="profile-phone"
                    name="number"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="profile-role"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400"
                  >
                    Role/Position
                  </label>
                  <input
                    id="profile-role"
                    className="w-full bg-slate-100/50 dark:bg-slate-900/20 border border-slate-200/50 dark:border-primary/5 rounded-md px-4 py-2.5 text-slate-500 dark:text-slate-400 cursor-not-allowed italic capitalize outline-none"
                    readOnly
                    type="text"
                    value={
                      user.role?.includes("ADMIN") || user.role === "ADMIN"
                        ? "Shop Manager (Admin)"
                        : "Shop Assistant (Seller)"
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  disabled={profilePending || uploadingAvatar}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
                >
                  {profilePending && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>

      {/* Password & Security Section */}
      <section className="bg-white dark:bg-background-dark/50 rounded-md border border-slate-200 dark:border-primary/10 p-8 shadow-sm">
        <form action={passwordAction}>
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="text-primary w-5 h-5" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
              Password & Security
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label
                htmlFor="current-password"
                className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400"
              >
                Current Password
              </label>
              <input
                id="current-password"
                name="currentPassword"
                className="w-full bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
                placeholder="••••••••••••"
                type="password"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="new-password"
                className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400"
              >
                New Password
              </label>
              <input
                id="new-password"
                name="newPassword"
                className="w-full bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
                placeholder="Min. 8 characters"
                type="password"
                minLength={8}
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400"
              >
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                className="w-full bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
                placeholder="Re-enter password"
                type="password"
                required
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/10 rounded-md w-full">
              <CircleAlert className="text-primary w-5 h-5 shrink-0" />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Security tip: Use a combination of uppercase letters, numbers,
                and special characters to ensure your vault stays secure.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={passwordPending}
                className="bg-slate-900 hover:bg-slate-800 dark:bg-primary dark:hover:bg-primary/90 text-white px-8 py-3 rounded-md text-sm font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2 border border-transparent"
              >
                {passwordPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Update Security
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
