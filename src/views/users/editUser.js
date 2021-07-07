import React, { useState, useEffect } from "react";
import FormData from "form-data";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CImg,
  CInputFile,
} from "@coreui/react";
import { useFormik } from "formik";
import {
  EditUserDetails,
  addUserList,
  ViewUserDetails,
  uploadImage,
} from "../../api";
import { useHistory, useParams } from "react-router-dom";
import { UserValidation } from "../../reusable/validations/loginValidations";
import DefaultUser from "../../assets/svgs/defaultUser";

export default function EditUser(props) {
  const history = useHistory();
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const [userDetails, setUserDetails] = useState({});
  const [showError, setShowError] = useState(null);
  const [msgError, setMsgError] = useState(null);
  const [image, setImage] = useState({});
  const [subscriptionStatus, setSubscriptionStatus] = useState(0);

  const initialValues = {
    name: userDetails.name ? userDetails.name : "",
    email: userDetails.email ? userDetails.email : "",
    country_code: userDetails.country_code ? userDetails.country_code : "",
    phone_no: userDetails.phone_no ? userDetails.phone_no : "",
    profile_picture_url: userDetails.profile_picture_url
      ? userDetails.profile_picture_url
      : "",
    subscription_status: userDetails.subscription_status
      ? userDetails.subscription_status
      : "",
    subscription_token_id: userDetails.subscription_token_id
      ? userDetails.subscription_token_id
      : "",
  };

  const formdata = new FormData();

  useEffect(() => {
    if (params.id) getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const res = await ViewUserDetails(params.id);
      if (res.status == 200) {
        setUserDetails(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfileChange = async (image) => {
    setImage(image);
  };

  const handleSubscriptionStatus = (type) => {
    setSubscriptionStatus(type);
  };

  const onSubmit = async (values, actions) => {
    try {
      let bodyFormData = {};
      setMsgError(null);
      if (image.type) {
        formdata.append("image", image, image.name);
        formdata.append("folderName", "user");
        const res = await uploadImage(formdata);
        if (res.status == 200) {
          bodyFormData.profile_picture_url = res.data.image_url;
        }
      }
      bodyFormData.name = values.name;

      if (params.id) {
        setLoading(true);
        const response = await EditUserDetails(bodyFormData, Number(params.id));
        setLoading(false);
        if (response) {
          setShowError(null);
          history.push("/users");
        }
      } else {
        bodyFormData.email = values.email;
        bodyFormData.country_code = values.country_code;
        bodyFormData.phone_no = values.phone_no;
        bodyFormData.subscription_status = subscriptionStatus;
        if (values.subscription_token_id) {
          bodyFormData.subscription_token_id = values.subscription_token_id;
        }
        setLoading(true);
        const response = await addUserList(bodyFormData);
        setLoading(false);
        if (response) {
          history.push("/users");
        }
      }
    } catch (error) {
      setLoading(false);
      actions.setFieldError("error", error.message);
      setMsgError(error.message);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit,
    validationSchema: UserValidation(subscriptionStatus),
  });

  return (
    <CContainer
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CCol xs="12" md="6">
        {params.id ? (
          <CCard>
            <CCardHeader style={{ fontFamily: "Lato" }}>
              <h3>
                <strong>Edit User Details</strong>
              </h3>
            </CCardHeader>
            <CCardBody style={{ fontFamily: "Roboto" }}>
              <CForm onSubmit={formik.handleSubmit} className="form-horizontal">
                <CFormGroup row>
                  <CCol xs="12" style={{ textAlign: "center" }}>
                    {userDetails.profile_picture_url ? (
                      <>
                        <CImg
                          src={userDetails.profile_picture_url}
                          className="c-avatar-img"
                          alt="admin@bootstrapmaster.com"
                          style={{
                            marginBottom: "2rem",
                            width: "6rem",
                            height: "6rem",
                          }}
                        />
                        <br />
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                          }}
                        >
                          Profile Picture
                        </span>
                      </>
                    ) : (
                      <DefaultUser style={{ marginBottom: "2rem" }} />
                    )}
                    <div style={{ marginLeft: "140px" }}>
                      <CInputFile
                        name="profile_picture_url"
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          formik.setFieldValue("profile_picture_url", "");

                          if (
                            e.target.files[0].type !== "image/png" &&
                            e.target.files[0].type !== "image/jpeg"
                          ) {
                            setShowError("Only jpeg, png images are allowed");
                            return;
                          }
                          setShowError(null);
                          handleProfileChange(e.target.files[0]);
                        }}
                      />
                      {showError ? (
                        <div className="email-validate">{showError}</div>
                      ) : null}
                    </div>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="hf-categorytype">
                      <h6>Enter User Name</h6>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="name"
                      name="name"
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <div className="email-validate">{formik.errors.name}</div>
                    ) : null}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="hf-categorytype">
                      <h6>Enter Email</h6>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="email"
                      disabled="true"
                      name="email"
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="email-validate">
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="hf-categorytype">
                      <h6>Enter Mobile Number</h6>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="phone_no"
                      name="phone_no"
                      disabled="true"
                      onBlur={formik.handleBlur}
                      value={formik.values.phone_no}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.phone_no && formik.errors.phone_no ? (
                      <div className="email-validate">
                        {formik.errors.phone_no}
                      </div>
                    ) : null}
                  </CCol>
                </CFormGroup>
                <CCardFooter
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  {loading ? (
                    <div className="spinner-border text-success" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    <CButton
                      type="submit"
                      style={{ width: "5rem" }}
                      color="success"
                    >
                      {params.id ? (
                        <strong>Update</strong>
                      ) : (
                        <strong>Add</strong>
                      )}
                    </CButton>
                  )}

                  <CButton
                    style={{ width: "5rem" }}
                    color="danger"
                    onClick={() => history.goBack()}
                  >
                    <strong>Cancel</strong>
                  </CButton>
                </CCardFooter>
              </CForm>
            </CCardBody>
          </CCard>
        ) : (
          <CCard>
            <CCardHeader style={{ fontFamily: "Lato" }}>
              <h3>
                <strong>Add User Details</strong>
              </h3>
            </CCardHeader>
            <CCardBody style={{ fontFamily: "Roboto" }}>
              <CForm onSubmit={formik.handleSubmit} className="form-horizontal">
                <CFormGroup row>
                  <CCol>
                    <DefaultUser
                      style={{ marginBottom: "2rem", marginLeft: "168px" }}
                    />
                    <div style={{ marginLeft: "150px" }}>
                      <CInputFile
                        name="profile_picture_url"
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          formik.setFieldValue("profile_picture_url", "");

                          if (
                            e.target.files[0].type !== "image/png" &&
                            e.target.files[0].type !== "image/jpeg"
                          ) {
                            setShowError("Only jpeg, png images are allowed");
                            return;
                          }
                          setShowError(null);
                          handleProfileChange(e.target.files[0]);
                        }}
                      />
                      {showError ? (
                        <div className="email-validate">{showError}</div>
                      ) : null}
                    </div>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="hf-categorytype">
                      <h6>User Name</h6>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="name"
                      name="name"
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <div className="email-validate">{formik.errors.name}</div>
                    ) : null}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="hf-categorytype">
                      <h6>Email</h6>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="email"
                      name="email"
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="email-validate">
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="hf-categorytype">
                      <h6>Mobile Number</h6>
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="country_code"
                      name="country_code"
                      placeholder="code"
                      onBlur={formik.handleBlur}
                      value={formik.values.country_code}
                      onChange={formik.handleChange}
                      style={{ marginBottom: "5px", width: "30%" }}
                    />
                    {formik.touched.country_code &&
                    formik.errors.country_code ? (
                      <div className="email-validate">
                        {formik.errors.country_code}
                      </div>
                    ) : null}
                    <CInput
                      type="text"
                      id="phone_no"
                      name="phone_no"
                      onBlur={formik.handleBlur}
                      value={formik.values.phone_no}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.phone_no && formik.errors.phone_no ? (
                      <div className="email-validate">
                        {formik.errors.phone_no}
                      </div>
                    ) : null}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="recipe_type">
                      <h6>Subscription Status?</h6>
                    </CLabel>
                  </CCol>
                  <CCol row md="4">
                    <label for={0}>
                      <CInput
                        type="radio"
                        id={0}
                        formControlName="recipe_type"
                        checked={subscriptionStatus == 0 ? "checked" : ""}
                        style={{
                          width: "20%",
                          marginTop: "-7px",
                          outline: "none !important",
                          cursor: "pointer",
                        }}
                        onChange={() => {
                          handleSubscriptionStatus(0);
                        }}
                      />
                      Free Trial
                    </label>
                  </CCol>
                  <CCol row md="4">
                    <label for={1}>
                      <CInput
                        type="radio"
                        id={1}
                        formControlName="recipe_type"
                        checked={subscriptionStatus == 1 ? "checked" : ""}
                        style={{
                          width: "10%",
                          marginTop: "-7px",
                          cursor: "pointer",
                        }}
                        onChange={() => {
                          handleSubscriptionStatus(1);
                        }}
                      />
                      Paid Subscription
                    </label>
                  </CCol>
                </CFormGroup>
                {subscriptionStatus == 1 ? (
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel htmlFor="hf-categorytype">
                        <h6>Subscription Token Id</h6>
                      </CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CInput
                        type="text"
                        id="subscription_token_id"
                        name="subscription_token_id"
                        onBlur={formik.handleBlur}
                        value={formik.values.subscription_token_id}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.subscription_token_id &&
                      formik.errors.subscription_token_id ? (
                        <div className="email-validate">
                          {formik.errors.subscription_token_id}
                        </div>
                      ) : null}
                    </CCol>
                  </CFormGroup>
                ) : (
                  ""
                )}
                {msgError ? (
                  <div className="email-validate">{msgError}</div>
                ) : null}
                <CCardFooter
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  {loading ? (
                    <div className="spinner-border text-success" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    <CButton
                      type="submit"
                      style={{ width: "5rem" }}
                      color="success"
                    >
                      {userDetails.name ? (
                        <strong>Update</strong>
                      ) : (
                        <strong>Add</strong>
                      )}
                    </CButton>
                  )}

                  <CButton
                    style={{ width: "5rem" }}
                    color="danger"
                    onClick={() => history.goBack()}
                  >
                    <strong>Cancel</strong>
                  </CButton>
                </CCardFooter>
              </CForm>
            </CCardBody>
          </CCard>
        )}
      </CCol>
    </CContainer>
  );
}
