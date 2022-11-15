import { useSession } from "next-auth/react";

export default function SocialSign() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <>
      <main className="flex justify-center py-10 px-4 pt-10 sm:px-12">
        <div className="">
          {loading && <div className="">Loading...</div>}
          {session && (
            <>
              {/*
              <p style={{ marginBottom: "10px" }}>
                {" "}
                Welcome, {session.user!.name ?? session.user!.email}
              </p>{" "}
              <br />
              <Image src={session.user!.image} alt="" className="" />
			  */}
            </>
          )}
          {!session && (
            <>
              <p className="">Please Sign in</p>
              <img
                src="https://cdn.dribbble.com/users/759083/screenshots/6915953/2.gif"
                alt=""
                className=""
              />
              <p className="">
                GIF by{" "}
                <a href="https://dribbble.com/shots/6915953-Another-man-down/attachments/6915953-Another-man-down?mode=media">
                  Another man
                </a>{" "}
              </p>
            </>
          )}
        </div>
      </main>
    </>
  );
}
