import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import Select from "react-select";
import { CardBody } from "reactstrap";
import partnerServices from "../../../apiServices/PartnerServices/PartnerServices";
import Pagination from "../Pagination/Pagination";
import DistributorsModal from "./DistributorsModal";
import NidModal from "./NidModal";
import NidModal2 from "./NidModal2";

const Distributors = () => {
  const [partners, setPartners] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    partnerName: "",
    telephone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    alternateNameInvoice: "",
    alternateNameOther: "",
    vatRegistrationNo: "",
    invoiceAddress: "",
    customerPrePaid: "",
    partnerType: "",
    defaultCurrency: 1,
  });
  const [selectedPartnerId, setPartnerId] = useState(null);
  const [dataPerPage, setDataPerPage] = useState(10);
  const [entity, setEntity] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // User select data per page
  const dataSizeArr = [10, 15, 20, 30, 50];
  const dataSizeName = dataSizeArr.map((dsn) => ({ label: dsn, value: dsn }));

  const selectDataSize = (value) => {
    setLoading(true);
    setDataPerPage(value);
  };

  // Fetch partners data
  useEffect(() => {
    fetchPartners();
  }, [currentPage, dataPerPage]);

  const fetchPartners = async () => {
    try {
      const data = await partnerServices.fetchPartners();
      setPartners(
        data.slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage)
      );
      setEntity(data.length);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
    setLoading(false);
  };

  const handleOpenModal = (partnerId = null) => {
    setPartnerId(partnerId);
    setModalOpen(true);
    if (partnerId) {
      fetchPartnerData(partnerId);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormData({
      partnerName: "",
      telephone: "",
      email: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      alternateNameInvoice: "",
      alternateNameOther: "",
      vatRegistrationNo: "",
      invoiceAddress: "",
      customerPrePaid: "",
      partnerType: "",
    });
    setPartnerId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      defaultCurrency: 1,
    };
    try {
      if (selectedPartnerId) {
        await partnerServices.updatePartner(
          selectedPartnerId,
          data,
          userInfo.token
        );
        toast.success("Partner information updated successfully!");
      } else {
        await partnerServices.createPartner(data, userInfo.token);
        toast.success("Partner created successfully!");
      }
      handleCloseModal();
      fetchPartners();
    } catch (error) {
      console.error("Error adding/updating partner:", error);
      toast.error("Failed to save partner information. Please try again.");
    }
  };

  const fetchPartnerData = async (partnerId) => {
    try {
      const data = await partnerServices.fetchPartnerById(
        partnerId,
        userInfo.token
      );
      setFormData({
        partnerName: data.partnerName || "",
        telephone: data.telephone || "",
        email: data.email || "",
        address1: data.address1 || "",
        address2: data.address2 || "",
        city: data.city || "",
        state: data.state || "",
        postalCode: data.postalCode || "",
        country: data.country || "",
        alternateNameInvoice: data.alternateNameInvoice || "",
        alternateNameOther: data.alternateNameOther || "",
        vatRegistrationNo: data.vatRegistrationNo || "",
        invoiceAddress: data.invoiceAddress || "",
        customerPrePaid: data.customerPrePaid || "",
        partnerType: data.partnerType || "",
      });
    } catch (error) {
      console.error("Error fetching partner data:", error);
    }
  };

  const handleDeletePartner = async (partnerId) => {
    toast(
      (t) => (
        <div>
          <p>Are you sure you want to delete this partner?</p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <button
              style={{
                padding: "8px 16px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "10px",
              }}
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              style={{
                padding: "8px 16px",
                backgroundColor: "#EA5455",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={async () => {
                try {
                  toast.dismiss(t.id);
                  const token = userInfo.token;
                  await partnerServices.deletePartner(partnerId, token);
                  fetchPartners();
                  toast.success("Partner deleted successfully!");
                } catch (error) {
                  console.error("Error deleting partner:", error);
                  toast.error("Failed to delete partner!");
                }
              }}
            >
              Confirm Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  const [openNidModal, setOpenNidModal] = useState(false);
  const handleOpenNidModal = () => setOpenNidModal(true);
  const handleCloseNidModal = () => setOpenNidModal(false);

  const [openNidModal2, setOpenNidModal2] = useState(false);
  const handleOpenNidModal2 = () => setOpenNidModal2(true);
  const handleCloseNidModal2 = () => setOpenNidModal2(false);

  return (
    <div>
      <DistributorsModal
        open={modalOpen}
        handleClose={handleCloseModal}
        handleSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        title={selectedPartnerId ? "Update Partner" : "Add Partner"}
        buttonText={selectedPartnerId ? "Update" : "Save"}
      />

      <NidModal
        openNidModal={openNidModal}
        handleCloseNidModal={handleCloseNidModal}
      />
      <NidModal2
        openNidModal2={openNidModal2}
        handleCloseNidModal2={handleCloseNidModal2}
      />

      <Card>
        <CardBody>
          <div className="border-bottom mb-4">
            <h4 className="pb-3">Partner</h4>
          </div>
          <div className="mt-4 container-fluid">
            <div className="row mb-3">
              <div className="col-md-4">
                <h6>Find Partner:</h6>
                <Form style={{ display: "flex", alignItems: "center" }}>
                  <Form.Control
                    placeholder="Search..."
                    style={{ marginRight: "10px" }}
                  />
                  <Button style={{ padding: "7px 30px" }} type="submit">
                    Find
                  </Button>
                  <Button
                    style={{ padding: "7px 30px", marginLeft: "1rem" }}
                    onClick={handleOpenNidModal}
                  >
                    Info
                  </Button>
                  <Button
                    style={{ padding: "7px 30px", marginLeft: "1rem" }}
                    onClick={handleOpenNidModal2}
                  >
                    Info2
                  </Button>
                </Form>
              </div>
              <div className="col-md-2"></div>
              <div
                className="col-md-6 d-flex justify-content-end"
                style={{ marginTop: "23px" }}
              >
                <div className="d-flex align-items-center mr-1">
                  <h6 className="mr-2 mb-0">Show : </h6>
                  <Select
                    defaultValue={dataSizeName[0]}
                    options={dataSizeName}
                    onChange={(e) => selectDataSize(e.value)}
                    className="w-auto"
                  />
                </div>

                <Button
                  style={{ padding: "7px 30px" }}
                  onClick={() => handleOpenModal()}
                >
                  Add Partner
                </Button>
              </div>
            </div>
          </div>

          <div
            className="overflow-auto"
            style={{ maxWidth: "100%", overflowX: "scroll" }}
          >
            <Table id="table-to-xls" className="table-sm table-bordered">
              <TableHead className="thead-uapp-bg">
                <TableRow style={{ textAlign: "center" }}>
                  <th>ID Partner</th>
                  <th align="right">Partner Name</th>
                  <th align="right">Email</th>
                  <th align="right">Coustomer Per/Post Paid</th>
                  <th align="right">Partner Type</th>
                  <th align="right">Action</th>
                </TableRow>
              </TableHead>
              <TableBody>
                {partners.map((row, i) => (
                  <TableRow key={row?.idPartner}>
                    <TableCell>{row?.idPartner}</TableCell>
                    <TableCell>{row?.partnerName}</TableCell>
                    <TableCell>{row?.email}</TableCell>
                    <TableCell>
                      {row?.customerPrePaid === 1 ? "Prepaid" : "Postpaid"}
                    </TableCell>
                    <TableCell>
                      {row?.partnerType === 1 ? "IOS" : "ANS"}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleOpenModal(row.idPartner)}>
                        Edit
                      </Button>{" "}
                      <Button
                        variant="danger"
                        onClick={() => handleDeletePartner(row.idPartner)}
                      >
                        Delete
                      </Button>{" "}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}

          <Pagination
            dataPerPage={dataPerPage}
            totalData={entity}
            paginate={paginate}
            currentPage={currentPage}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default Distributors;
