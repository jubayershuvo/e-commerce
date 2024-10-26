import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from "react-router-dom";
import DeliveryAddress from "../../components/DeliveryAddress";
import OrderSummary from "../../components/OrderSummary";
import { useSelector } from "react-redux";

const steps = ["Login", "Shipping Address", "Order Summary", "Payment"];

export default function CheckOut() {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  // const { cartList } = useSelector((state) => state.Users);
  const [activeStep, setActiveStep] = React.useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const querySearch = new URLSearchParams(location.search);
  const step = querySearch.get("step");

  React.useEffect(() => {
    if (step && !isNaN(step)) {
      setActiveStep(Number(step) - 1);
    }
  }, [step]);

  React.useEffect(() => {
    if (isLoggedIn === true) {
      navigate("/checkout?step=2");
    } else {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const updateStepInURL = (step) => {
    navigate(`?step=${step + 1}`);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => {
      const newStep = prevActiveStep + 1;
      updateStepInURL(newStep);
      return newStep;
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => {
      const newStep = prevActiveStep - 1;
      updateStepInURL(newStep);
      return newStep;
    });
  };

  return (
    <div className="px-5 lg:px-20 pt-5 dark:bg-gray-900 dark:text-white">
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>
                <p className="dark:text-gray-300 text-gray-900 text-[10px] md:text-base">
                  {label}
                </p>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography
              sx={{ mt: 2, mb: 1 }}
              className="dark:text-gray-300 text-sm lg:text-base"
            >
              All steps completed - you're finished
            </Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {activeStep === 1 && (
              <DeliveryAddress
                user={user}
                handleNext={handleNext}
              />
            )}
            {activeStep === 2 && (
              <OrderSummary user={user} handleBack={handleBack} handleNext={handleNext} />
            )}
          </React.Fragment>
        )}
      </Box>
    </div>
  );
}
