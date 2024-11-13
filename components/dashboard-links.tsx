"use client";
import {
  createLink,
  deleteLink,
  editLink,
  getHosts,
  getLink,
  getLinks,
  getLinkwithHost,
  requireLogin,
} from "@/backend/actions";
import {
  Link,
  Card,
  Button,
  Skeleton,
  Spacer,
  Modal,
  useDisclosure,
  Tooltip,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
  CardHeader,
  CardBody,
  Divider,
  CardFooter,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import Icon from "./boxicon";
// import Link from "next/link";
import { Slide, toast, ToastContainer } from "react-toastify";
const { v4: uuidv4 } = require("uuid");
import "react-toastify/dist/ReactToastify.css";

interface DashLinksProps {
  UserID: string;
  UUID: string;
  changeTab: (tab: string) => void;
  Links: Array<any>;
}

interface Link {
  UserID: string;
  UUID: string;
  Slug: string;
  Redirect: string;
  URL: string;
  Host: string;
}

interface Hosts {
  UUID: string;
  URL: string;
  APIKey: string;
}

export function DashLinks({
  UserID,
  UUID,
  changeTab,
  Links,
}: DashLinksProps): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [linksData, setLinks] = useState<Link[]>([]);
  const [editLinkData, setEditLink] = useState<Link | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [getHost, setHost] = useState<Hosts[]>([]);
  const [modalId, setModalId] = useState<string | null>(null);
  const [loadCreated, setLoadCreated] = useState(false);
  const [slug, setSlug] = useState("");

  const trimEllip = function (text: string, length: number) {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
  };

  const handleOpen = (id: string) => {
    setModalId(id);
    onOpen();
  };

  useEffect(() => {
    async function dataLinks() {
      if (
        (linksData.length >= 1 && getHost.length >= 1) ||
        getHost.length >= 1 ||
        linksData.length >= 1
      ) {
        setLoading(false);
        return;
      }

      const links = await getLinks(UserID);
      setLinks(links);
      const hosts = await getHosts();
      setHost(hosts);
    }
    dataLinks();
  }, [linksData, getHost]);

  const setLink = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoadCreated(true);

    const host = (document.getElementById("host") as HTMLSelectElement).value;
    const redirect = (document.getElementById("redirect") as HTMLInputElement)
      .value;
    const slug = (document.getElementById("slug") as HTMLInputElement).value;
    const uuid = (document.getElementById("uuid") as HTMLInputElement).value;
    const userID = (document.getElementById("userID") as HTMLInputElement)
      .value;

    const link = await getLinkwithHost(slug, host);

    if (host === "" || redirect === "") {
      toast("Please fill in all required fields", {
        type: "error",
      });
      setLoadCreated(false);
      return;
    }

    if (slug === link.Slug) {
      toast("Slug already exists", {
        type: "error",
      });
      setLoadCreated(false);
      return;
    }

    await createLink(userID, slug, redirect, uuid, host);
    setLinks([]);
    setHost([]);
    setLoading(false);
    toast("Link created successfully", {
      type: "success",
    });

    setLoadCreated(false);
    onOpenChange();
    return;
  };

  async function fdeleteLink(userId: string, Slug: string) {
    await deleteLink(userId, Slug);
    setLinks([]);
    setHost([]);
    toast("Link deleted successfully", {
      type: "success",
    });
    setLoading(false);
    return;
  }

  const feditLink = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoadCreated(true);

    const redirect = (
      document.getElementById("editredirect") as HTMLInputElement
    ).value;
    const slug = (document.getElementById("editslug") as HTMLInputElement)
      .value;
    const userID = (document.getElementById("edituserID") as HTMLInputElement)
      .value;

    if (!slug || !redirect) {
      toast("Please fill in all required fields", {
        type: "error",
      });
      setLoadCreated(false);
      return;
    }

    if (slug.startsWith("http") || slug.startsWith("https")) {
      toast("Slug cannot be a URL", {
        type: "error",
      });
      setLoadCreated(false);
      return;
    }

    if (slug.startsWith("/")) {
      toast("Slug cannot start with a forward slash", {
        type: "error",
      });
      setLoadCreated(false);
      return;
    }

    if (redirect === "") {
      toast("Please fill in all required fields", {
        type: "error",
      });
      setLoadCreated(false);
      return;
    }

    await editLink(userID, slug, redirect);
    setLinks([]);
    setHost([]);
    setLoading(false);
    toast("Link edited successfully", {
      type: "success",
    });
    onOpenChange();
    return;
  };

  const genSlug = async () => {
    setSlug(uuidv4().slice(0, 8));
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
        <Button onPress={() => handleOpen("create")}>Create a Link</Button>
        <br></br>
        <br></br>
        <br></br>
        {modalId === "create" && (
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Create a Link
                  </ModalHeader>
                  <ModalBody>
                    <form
                      className="space-y-4 p-4 rounded-lg shadow-md"
                      onSubmit={setLink}
                    >
                      <Tooltip content="Select the host you want to use">
                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor="host"
                            className="text-xl font-semibold text-gray-100"
                          >
                            Host
                            <p className="text-red-600 inline uppercase">*</p>
                          </label>
                          <select
                            id="host"
                            name="host"
                            required
                            className="text-sm w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="" disabled selected>
                              Select a host
                            </option>
                            {getHost.map((host) => (
                              <option key={host.UUID} value={host.UUID}>
                                {host.URL}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Tooltip>

                      <Tooltip content="Enter the URL you want to redirect to">
                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor="redirect"
                            className="text-xl font-semibold text-gray-100"
                          >
                            Redirect
                            <p className="text-red-600 inline uppercase">*</p>
                          </label>
                          <input
                            type="text"
                            id="redirect"
                            required
                            name="redirect"
                            placeholder="Enter redirect URL"
                            className="text-sm w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </Tooltip>

                      <Tooltip content="The slug for your redirect (e.g., linkr.li/your-slug)">
                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor="slug"
                            className="text-xl font-semibold text-gray-100"
                          >
                            Slug
                            <p className="text-red-600 inline uppercase">*</p>
                          </label>
                          <input
                            type="text"
                            required
                            id="slug"
                            value={slug}
                            name="slug"
                            placeholder="Enter a custom slug"
                            className="text-sm w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onChange={handleSlugChange}
                          />{" "}
                          <button
                            type="button"
                            className=" border border-transparent bg-gray-700 rounded-xl px-2 py-1 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onClick={genSlug}
                          >
                            {" "}
                            <Icon name="bx-refresh" size={"20px"} />
                          </button>
                        </div>
                      </Tooltip>

                      <input
                        type="hidden"
                        id="uuid"
                        name="uuid"
                        value={uuidv4()}
                      />
                      <input
                        type="hidden"
                        id="userID"
                        name="userID"
                        value={UserID}
                      />

                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" color="primary" variant="light">
                          Create Redirect
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

      {modalId === "edit:" + editLinkData?.Slug && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex-col gap-1 inline">
                  Edit{" "}
                  <code className="inline text-gray-500">
                    {editLinkData?.Slug}
                  </code>
                </ModalHeader>
                <ModalBody>
                  <form
                    className="space-y-4 p-4 rounded-lg shadow-md"
                    onSubmit={feditLink}
                  >
                    <Tooltip content="Enter the URL you want to redirect to">
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="editredirect"
                          className="text-xl font-semibold text-gray-100"
                        >
                          Redirect
                        </label>
                        <input
                          type="text"
                          disabled={false}
                          id="editredirect"
                          name="editredirect"
                          placeholder="Enter redirect URL"
                          className="text-sm w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </Tooltip>
                    <input
                      type="hidden"
                      id="edituserID"
                      name="edituserID"
                      value={UserID}
                    />
                    <input
                      type="hidden"
                      id="editslug"
                      name="editslug"
                      value={editLinkData?.Slug}
                    />
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Cancel
                      </Button>
                      <Button type="submit" color="primary" variant="light">
                        Edit Redirect
                      </Button>
                    </ModalFooter>
                  </form>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}

      {loading ? (
        <div className="grid grid-cols-3 gap-4 mt-10">
          <Skeleton className="rounded-lg p-10 w-full h-full">
            <Card className="max-w-[400px]">
              <CardHeader className="flex gap-3"></CardHeader>
              <Divider />
              <CardBody></CardBody>
              <Divider />
              <CardFooter></CardFooter>
            </Card>
          </Skeleton>
        </div>
      ) : (
        <>
          <Table fullWidth aria-label="Example empty table">
            <TableHeader>
              <TableColumn>URL</TableColumn>
              <TableColumn>Slug</TableColumn>
              <TableColumn>Redirect</TableColumn>
              <TableColumn>Host</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No rows to display."}>
              {linksData.map((link) => (
                <TableRow key={link.Slug}>
                  <TableCell>
                    <Link
                      showAnchorIcon
                      isExternal
                      href={"https://" + link.URL}
                    >
                      <Tooltip showArrow placement="top" content={link.URL}>
                        {trimEllip(link.URL, 25)}
                      </Tooltip>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Tooltip showArrow placement="top" content={link.Slug}>
                      {trimEllip(link.Slug, 10)}
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip showArrow placement="top" content={link.Redirect}>
                      {trimEllip(link.Redirect, 20)}
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      showArrow
                      placement="top"
                      content={link.URL.split("/")[0]}
                    >
                      {trimEllip(link.URL.split("/")[0], 20)}
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="mr-2"
                      isIconOnly
                      onPress={() => {
                        setEditLink(link);
                        handleOpen("edit:" + link.Slug);
                      }}
                    >
                      <Icon name="bx-edit" size={"20px"} />
                    </Button>
                    <Button
                      className="mr-2"
                      isIconOnly
                      onPress={() => {
                        navigator.clipboard.writeText(link.URL);
                        toast("Copied to clipboard", {
                          type: "success",
                          // onClick: () => {
                          //   toast("Secret: Nice one!", {
                          //     type: "info",
                          //   });
                          // },
                        });
                      }}
                    >
                      <Icon name="bx-copy" size={"20px"} />
                    </Button>
                    <Button
                      isIconOnly
                      onPress={() => {
                        fdeleteLink(link.UserID, link.Slug);
                      }}
                    >
                      <Icon name="bx-trash" size={"20px"} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
}
