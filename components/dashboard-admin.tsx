"use client";
import {
  createHost,
  deleteHost,
  deleteHostLinks,
  getHost,
  getHosts,
} from "@/backend/actions";
import {
  Card,
  Spacer,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Skeleton,
  Button,
  Modal,
  ModalContent,
  useDisclosure,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Tooltip,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import Icon from "./boxicon";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { Slide, toast, ToastContainer } from "react-toastify";
const { v4: uuidv4 } = require("uuid");
const uuids = uuidv4();
const apiuuids = uuidv4();

interface DashAdminProps {
  UserID: string;
  Links: Array<any>;
  AccessToken: string;
  changeTab: (tab: string) => void;
  isAdmin: boolean;
}

interface Hosts {
  UUID: string;
  URL: string;
  APIKey: string;
}

export function DashAdmin({
  UserID,
  Links,
  AccessToken,
  changeTab,
  isAdmin,
}: DashAdminProps): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [loadCreated, setLoadCreated] = useState(false);
  const [loadHosts, setLoadHosts] = useState(true);
  const [hostsdata, setHostsData] = useState<Hosts[]>([]);
  const [modalId, setModalId] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    async function getData() {
      if (!isAdmin) {
        return changeTab("overview");
      }
      setLoading(false);
    }
    getData();

    if (hostsdata.length >= 1) {
      return;
    }
    async function getHostsData() {
      const hosts = await getHosts();
      setHostsData(hosts);
      setLoadHosts(false);
    }
    getHostsData();
  }, [isAdmin, changeTab, hostsdata.length]);

  const setHost = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoadCreated(true);

    const host = await getHost(
      (document.getElementById("url") as HTMLInputElement)?.value
    );

    if (!(document.getElementById("url") as HTMLInputElement)?.value) {
      toast("URL is required", {
        type: "error",
      });
      setLoadCreated(false);
      return;
    }

    if (host.URL) {
      toast("Host already exists", {
        type: "error",
      });
      setLoadCreated(false);
      return;
    }
    if (
      (document.getElementById("url") as HTMLInputElement)?.value.includes(
        "http"
      ) ||
      (document.getElementById("url") as HTMLInputElement)?.value.includes(
        "https"
      )
    ) {
      toast("URL must not contain http or https", {
        type: "error",
      });
      setLoadCreated(false);
      return;
    }

    if (
      !(document.getElementById("url") as HTMLInputElement)?.value.includes(
        "."
      ) ||
      (document.getElementById("url") as HTMLInputElement)?.value.includes("/")
    ) {
      toast("This is not a valid URL", {
        type: "error",
      });
      setLoadCreated(false);
      return;
    }

    await createHost(
      (document.getElementById("url") as HTMLInputElement)?.value,
      (document.getElementById("apikey") as HTMLInputElement)?.value,
      (document.getElementById("uuid") as HTMLInputElement)?.value
    );
    setLoadCreated(false);
    const hosts = await getHosts();
    setHostsData(hosts);
    toast("Your host has been created", {
      type: "success",
    });
    onOpenChange();
    return;
  };

  const handleOpen = (id: string) => {
    setModalId(id);
    onOpen();
  };

  const fdelteHost = async (id: string) => {
    await deleteHost(id);
    await deleteHostLinks(id);
    
    const hosts = await getHosts();
    setHostsData(hosts);
    toast("Host has been deleted", {
        type: "success",
      });
      onOpenChange();
      return;
  };

  return (
    <>
      <div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          stacked
          transition={Slide}
        />
        <Button onPress={() => handleOpen("create")}>Create a Host</Button>
        {modalId === "create" && (
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Create a Link Host
                  </ModalHeader>
                  <ModalBody>
                    <form
                      className="space-y-4 p-4 rounded-lg shadow-md"
                      onSubmit={setHost}
                    >
                      <Tooltip content="This is the URL that will be used to access the host">
                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor="url"
                            className="text-xl font-semibold text-gray-100"
                          >
                            URL
                            <p className="text-red-600 inline uppercase">*</p>
                          </label>
                          <input
                            required
                            placeholder="Use your link url like our linkr.li no https/http"
                            type="text"
                            id="url"
                            name="url"
                            className="text-sm w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </Tooltip>
                      <Tooltip content="This is a unique key that will be used to authenticate your requests to the API!">
                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor="apikey"
                            className="text-xl font-semibold text-gray-100"
                          >
                            API Key
                          </label>
                          <input
                            disabled
                            value={apiuuids}
                            type="text"
                            id="apikey"
                            name="apikey"
                            className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <Button
                            onClick={() =>
                              navigator.clipboard.writeText(
                                (
                                  document.getElementById(
                                    "apikey"
                                  ) as HTMLInputElement
                                ).value
                              )
                            }
                          >
                            <Icon name="bx-copy" size="18px" />
                          </Button>
                        </div>
                      </Tooltip>
                      <Tooltip content="This is the unique identifier for the host">
                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor="uuid"
                            className="text-xl font-semibold text-gray-100"
                          >
                            UUID
                          </label>
                          <input
                            disabled
                            value={uuids}
                            type="text"
                            id="uuid"
                            name="uuid"
                            className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </Tooltip>
                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          color="primary"
                          isLoading={loadCreated}
                          variant="light"
                        >
                          Create Host
                        </Button>
                      </ModalFooter>
                    </form>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
      </div>

      {loadHosts ? (
        <Skeleton className="rounded-lg mt-14 w-full h-full">
          <div className="">
            <Card className="max-w-[400px]">
              <CardHeader className="flex gap-3"></CardHeader>
              <Divider />
              <CardBody></CardBody>
              <Divider />
              <CardFooter></CardFooter>
            </Card>
          </div>
        </Skeleton>
      ) : null}

      {loadHosts ? null : (
        <div className="flex flex-wrap">
          {hostsdata.map((host) => (
            <div key={host.UUID} className="flex flex-col gap-4">
              <Card className="max-w-[400px] ml-10 mt-5 w-30">
                <CardHeader className="flex gap-3">
                  <h4 className="text-lg font-semibold">Host</h4>
                  <Spacer />
                  <Button
                    className="flex grap size-1 bg-none border-none hover:bg-red-500"
                    onPress={() => handleOpen(host.UUID)}
                  >
                    <Icon name="bx-trash" size="18px" />
                  </Button>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <p className="text-sm font-semibold">UUID:</p>
                      <p className="text-sm">{host.UUID}</p>
                    </div>
                    <div className="flex gap-2">
                      <p className="text-sm font-semibold">URL:</p>
                      <p className="text-sm">
                        <Link
                          href={"http://" + host.URL}
                          target="_blank"
                          className="text-blue-300"
                        >
                          {host.URL}
                        </Link>
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <p className="text-sm font-semibold inline">API Key:</p>
                      <p className="text-xs">
                        <Button
                          className="text-xs inline-flex items-center px-2 py-1 border border-transparent font-medium rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-blue-500 hover:text-white"
                          onClick={() =>
                            navigator.clipboard.writeText(host.APIKey)
                          }
                        >
                          <span className="text-xs">
                            {host.APIKey.split("-")[0] +
                              "-" +
                              host.APIKey.split("-")[1].replaceAll(/./g, "x") +
                              "-" +
                              host.APIKey.split("-")[2].replaceAll(/./g, "x") +
                              "-" +
                              host.APIKey.split("-")[3].replaceAll(/./g, "x") +
                              "-" +
                              host.APIKey.split("-")[4].replaceAll(/./g, "x")}
                          </span>
                          <Icon name="bx-copy" size="12px" />
                        </Button>
                      </p>
                    </div>
                  </div>
                </CardBody>
                <Divider />
                <CardFooter></CardFooter>
              </Card>
              {modalId === host.UUID && (
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Delete Host
                        </ModalHeader>
                        <ModalBody>
                          <h2>If you delete your Host. You delete all Data!</h2>

                          <ModalFooter>
                            <Button
                              color="danger"
                              variant="light"
                              onPress={onClose}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              color="primary"
                              onClick={() => fdelteHost(modalId)}
                              variant="light"
                            >
                              Delete Host
                            </Button>
                          </ModalFooter>
                        </ModalBody>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
