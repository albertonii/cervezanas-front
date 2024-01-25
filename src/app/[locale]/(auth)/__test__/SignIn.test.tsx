import { NextIntlClientProvider } from "next-intl";
import { AppContextProvider } from "../../../context/AppContext";
import createServerClient from "../../../../utils/supabaseServer";
import { AuthContextProvider } from "../../Auth/AuthContext";
import ReactQueryWrapper from "../../ReactQueryWrapper";
import SignIn from "../signin/SignIn";

describe("Signin", () => {
  it("should render the signin page", async () => {
    // const supabase = createServerClient();
    // const {
    //   data: { session },
    // } = await supabase.auth.getSession();
    // render(
    //   <NextIntlClientProvider
    //     locale={"es"}
    //     messages={{
    //       product_pack_name: "Pack",
    //       product_name: "Producto",
    //       quantity: "Cantidad",
    //     }}
    //   >
    //     <ReactQueryWrapper>
    //       <AuthContextProvider serverSession={session}>
    //         <AppContextProvider>
    //           <SignIn />
    //         </AppContextProvider>
    //       </AuthContextProvider>
    //     </ReactQueryWrapper>
    //   </NextIntlClientProvider>
    // );
  });

  // it("should render title correctly", () => {
  //   render(<SignIn />);
  //   const prueba = screen.getByText("prueba 23");
  //   expect(prueba).toBeInTheDocument();
  // });

  /*
    it("should return a 400 with an invalid email", async () => {
    return request(app)
      .post("/api/users/signin")
      .send({
        email: "example@mail.com", // invalid email
        password: "password",
      })
      .expect(400);
  });

  it("should return a 400 with an invalid password", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "example@mail.com",
        password: "password",
      })
      .expect(201);
  });

  it("should return a 400 with missing email and password", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "example@mail.com",
        password: "password",
      })
      .expect(201);
  });
  */
});
