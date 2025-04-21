import "../css/QuickLog.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";

const QuickLog = () => {
  return (
    <div className="quicklogUltraContainer">
      <div className="quicklog_Container">
        <div className="quicklog_Container_Wrapper">
          <h1 className="quicklog_Container_Wrapper_Title">
            Create an account
          </h1>

          <p className="quicklog_Container_Wrapper_Text">
            Already have an account?{" "}
            <a href="#" className="quicklog_Container_Wrapper_Link">
              Sign in
            </a>
          </p>

          <div className="quicklog_Container_Wrapper_Buttons">
            <button className="quicklog_Container_Wrapper_Button quicklog_Container_Wrapper_Button--facebook">
              <span className="quicklog_Container_Wrapper_Button_Icon">
                <FacebookIcon fontSize="medium" />
              </span>
              Continue with Facebook
            </button>

            <button className="quicklog_Container_Wrapper_Button quicklog_Container_Wrapper_Button--google">
              <span className="quicklog_Container_Wrapper_Button_Icon">
                <GoogleIcon fontSize="medium" />
              </span>
              Continue with Google
            </button>
          </div>

          <div className="quicklog_Container_Wrapper_Divider">
            <span className="quicklog_Container_Wrapper_Divider_Line"></span>
            <span className="quicklog_Container_Wrapper_Divider_Text">or</span>
            <span className="quicklog_Container_Wrapper_Divider_Line"></span>
          </div>

          <div className="quicklog_Container_Wrapper_Field">
            <label className="quicklog_Container_Wrapper_Field_Label">
              Enter your email address to create an account.
            </label>
            <input
              type="email"
              className="quicklog_Container_Wrapper_Field_Input"
              placeholder="Email address"
            />

            <button className="quicklog_Container_Wrapper_Field_Button">Create An Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickLog;
