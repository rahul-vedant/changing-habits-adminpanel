import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CTooltip,
  CSwitch,
  CModal,
  CModalHeader,
  CModalFooter,
  CModalBody,
  CButton,
  CModalTitle,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CSelect,
} from "@coreui/react";
import { freeSet } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import moment from "moment";

import { GetUserList, ChangeUserStatus } from "../../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const getBadge = (status) => {
  switch (status) {
    case "Active":
      return "success";
    case "Banned":
      return "danger";
    default:
      return "primary";
  }
};

var account_type = [
  {
    label: "Select account type",
    value: null,
  },
  {
    label: "Active",
    value: 1,
  },
  {
    label: "Blocked",
    value: 0,
  },
];

const fields = [
  { key: "currentId", label: "Id", _style: { fontFamily: "Poppins" } },
  { key: "name", label: "Username", _style: { fontFamily: "Poppins" } },
  {
    key: "email",
    label: "Email",
    _style: { fontFamily: "Poppins" },
  },
  {
    key: "phone_no",
    label: "Mobile",
    _style: { fontFamily: "Poppins" },
  },
  {
    key: "created_at",
    label: "Signup Date",
    _style: { fontFamily: "Poppins" },
  },
  { key: "status", _style: { fontFamily: "Poppins" } },
  {
    key: "show_details",
    label: "Action",
    _style: { minWidth: "7rem" },
    sorter: false,
    filter: false,
  },
];
const Users = () => {
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState(null);

  const history = useHistory();

  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const queryPageSEarch = useLocation().search.match(
    /search=([A-Za-z0-9 _]+)/,
    ""
  );

  const currentPageSearch =
    queryPageSEarch && queryPageSEarch[1] ? queryPageSEarch[1] : "";

  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);

  const [page, setPage] = useState(currentPage);

  const [data, setData] = useState([]);
  const [count, setCount] = useState();
  const [userId, setUserId] = useState(null);
  const [onsearchCHange, setOnSearchChange] = useState(
    currentPageSearch ? currentPageSearch : ""
  );
  const [active, setActive] = useState(null);
  const [enableModal, setEnableModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  let currentId = page && page * 10 - 10;

  const pageChange = (newPage) => {
    let newPage1 = newPage;
    if (newPage1 === 0) {
      newPage1 = 1;
    }
    currentPage !== newPage &&
      history.push(`/users?search=${onsearchCHange}&page=${newPage1}`);
  };

  const toggleEnable = (id, status) => {
    setUserId(id);
    setActive(status);
    setEnableModal(!enableModal);
  };

  const handleEnable = async () => {
    try {
      setEnableModal(!enableModal);
      let pass;
      if (active) {
        pass = 0;
      } else {
        pass = 1;
      }
      await ChangeUserStatus(userId, pass);
      setRefresh(!refresh);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteModal(!deleteModal);
      await ChangeUserStatus(userId, 3);
      setRefresh(!refresh);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (e) => {
    setOnSearchChange(e.target.value);
  };

  const handleSearch = async () => {
    currentPageSearch !== onsearchCHange &&
      history.push(`/users?search=${onsearchCHange}&page=${page}`);
  };

  const handleReset = () => {
    setOnSearchChange("");
    let newPage = page;
    if (newPage === 0) {
      newPage = 1;
    }
    history.push(`/users?page=${newPage}`);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        setData([]);
        const data = accountType
          ? await GetUserList(
              currentPage,
              currentPageSearch,
              Number(accountType)
            )
          : await GetUserList(currentPage, currentPageSearch);
        setLoading(false);
        data.rows.map((item) => {
          item._classes = "catTableItem";

          if (item.created_at) {
            item.created_at = moment(item.created_at).format("LLL");
          }

          return item;
        });
        setData(data.rows);
        setCount(data.count);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    getData();

    currentPage !== page && setPage(currentPage);
  }, [currentPage, currentPageSearch, refresh, page, accountType]);

  return (
    <CRow>
      <CModal
        show={enableModal}
        centered={true}
        color="warning"
        onClose={setEnableModal}
        backdrop={true}
        style={{ fontFamily: "Poppins" }}
      >
        <CModalHeader style={{ height: "3rem" }}>
          <CModalTitle>{active ? "Block User?" : "Unblock User?"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {active
            ? "Are you sure you want to Block the User?"
            : "Are you sure you want to Unblock the User?"}
        </CModalBody>
        <CModalFooter style={{ height: "4rem" }}>
          <CButton color="success" onClick={handleEnable}>
            Yes
          </CButton>{" "}
          <CButton color="secondary" onClick={() => setEnableModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        show={deleteModal}
        centered={true}
        backdrop={true}
        color="warning"
        onClose={setDeleteModal}
      >
        <CModalHeader>
          <CModalTitle>Delete User Account?</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to Delete the User account?
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleDelete}>
            Yes
          </CButton>{" "}
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
      <CCol xxl={12}>
        <CCard>
          <CCardHeader style={{ fontFamily: "Lato" }}>
            <h2>
              <strong>User Management</strong>
            </h2>
            <CButton
              style={{
                width: "5rem",
                marginLeft: "90%",
                backgroundColor: "teal",
                color: "white",
              }}
              onClick={() => history.push("/addUser")}
            >
              <strong>Add</strong>
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={data}
              fields={fields}
              hover
              border
              addTableClasses="table-class"
              striped
              loading={loading}
              noItemsViewSlot={
                !loading ? "" : <div style={{ height: "14rem" }}></div>
              }
              clickableRows
              overTableSlot={
                <CCol style={{ marginBottom: "1rem", display: "flex" }}>
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText
                        style={{ backgroundColor: "teal", color: "white" }}
                      >
                        <CIcon content={freeSet.cilSearch} />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      style={{ maxWidth: "15rem" }}
                      value={onsearchCHange}
                      onChange={handleSearchChange}
                      id="input1-group1"
                      name="input1-group1"
                      placeholder="Search by Name or Email"
                    />

                    <CButton
                      onClick={handleSearch}
                      style={{
                        marginLeft: "1rem",
                        backgroundColor: "teal",
                        color: "white",
                      }}
                    >
                      Search
                    </CButton>
                    <CButton
                      onClick={() => {
                        handleReset();
                      }}
                      style={{
                        marginLeft: "1rem",
                        backgroundColor: "teal",
                        color: "white",
                      }}
                    >
                      Reset
                    </CButton>
                  </CInputGroup>
                  <CInputGroup style={{ width: "30%" }}>
                    <CSelect
                      onChange={(e) => {
                        setAccountType(e.target.value);
                      }}
                      custom
                      value={accountType}
                      placeholder="Select account type"
                      name="status"
                      id="status"
                    >
                      {account_type.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </CSelect>
                  </CInputGroup>
                </CCol>
              }
              underTableSlot={
                <div style={{ marginBottom: "1rem" }}>
                  Showing {page * 10 - 9}-
                  {page * 10 < count ? page * 10 : count} of {count}
                </div>
              }
              scopedSlots={{
                currentId: (item) => {
                  currentId++;
                  return <td>{currentId}</td>;
                },
                email: (item) => <td>{item.email}</td>,
                status: (item) => (
                  <td>
                    {item.status == 1 ? (
                      <CBadge
                        style={{ width: "4rem", height: "1.1rem" }}
                        shape="pill"
                        color={getBadge("Active")}
                      >
                        Active
                      </CBadge>
                    ) : (
                      <CBadge
                        style={{ width: "4rem", height: "1.1rem" }}
                        shape="pill"
                        color={getBadge("Banned")}
                      >
                        Blocked
                      </CBadge>
                    )}
                  </td>
                ),
                show_details: (item, index) => {
                  return (
                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}
                      >
                        <CTooltip content={"Edit User"} placement={"top-start"}>
                          <CIcon
                            onClick={() =>
                              history.push({
                                pathname: `/editUser/${item.id}`,
                                state: { item },
                              })
                            }
                            style={{ color: "black", cursor: "pointer" }}
                            size="lg"
                            content={freeSet.cilPencil}
                          />
                        </CTooltip>
                        <CTooltip content={`View User`} placement={"top-start"}>
                          <FontAwesomeIcon
                            color="green"
                            size="lg"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              history.push({
                                pathname: `/user/${item.id}`,
                                state: { item },
                              })
                            }
                            icon={faEye}
                          />
                        </CTooltip>
                        <CSwitch
                          onChange={() => toggleEnable(item.id, item.status)}
                          size="sm"
                          variant={"3d"}
                          color={"success"}
                          checked={item.status}
                        />
                      </div>
                    </td>
                  );
                },
              }}
            />
            <CPagination
              activePage={page}
              pages={Math.ceil(count / 10)}
              onActivePageChange={pageChange}
              doubleArrows={true}
              align="start"
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Users;
