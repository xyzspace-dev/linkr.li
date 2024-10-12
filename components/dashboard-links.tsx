"use client";
import { createLink, deleteLink, editLink, getHosts, getLink, getLinks, requireLogin } from '@/backend/actions';
import { Card, Button, Skeleton, Spacer, Modal, useDisclosure, Tooltip, ModalHeader, ModalContent, ModalBody, ModalFooter, CardHeader, CardBody, Divider, CardFooter } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import Icon from './boxicon';
import Link from 'next/link';
const { v4: uuidv4 } = require("uuid");
const uuids = uuidv4();

interface DashLinksProps {
    UserID: string;
    UUID: string;
    changeTab: (tab: string) => void;
}

interface Links {
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

export function DashLinks({ UserID, UUID, changeTab }: DashLinksProps): JSX.Element {
    const [loading, setLoading] = useState(true);
    const [linksData, setLinks] = useState<Links[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [getHost, setHost] = useState<Hosts[]>([]);
    const [modalId, setModalId] = useState<string | null>(null);
    const [loadCreated, setLoadCreated] = useState(false);

    const handleOpen = (id: string) => {
        setModalId(id);
        onOpen();
    };

    useEffect(() => {
        async function dataLinks() {
            if (linksData.length >= 1 && getHost.length >= 1 || getHost.length >= 1 || linksData.length >= 1) {
                setLoading(false);
                return;
            }

            const links = await getLinks();
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
        const redirect = (document.getElementById("redirect") as HTMLInputElement).value;
        const slug = (document.getElementById("slug") as HTMLInputElement).value;
        const uuid = (document.getElementById("uuid") as HTMLInputElement).value;
        const userID = (document.getElementById("userID") as HTMLInputElement).value;

        const link = await getLink(slug);

        if (host === "" || redirect === "") {
            alert("Please fill in all required fields");
            setLoadCreated(false);
            return;
        }

        if (slug === link.Slug) {
            alert("Slug already exists");
            setLoadCreated(false);
            return;
        }

        await createLink(userID, slug, redirect, uuid, host);
        const links = await getLinks();
        setLinks(links);
        const hosts = await getHosts();
        setHost(hosts);
        setLoading(false);
        alert("Link created successfully");
        setLoadCreated(false);

        return;
    };

    async function fdeleteLink(userId: string, Slug: string) {
        await deleteLink(userId, Slug)
        const links = await getLinks();
        setLinks(links);
        const hosts = await getHosts();
        setHost(hosts);
        setLoading(false);
        return;
    }

    const feditLink = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoadCreated(true);

        const redirect = (document.getElementById("editredirect") as HTMLInputElement).value;
        const slug = (document.getElementById("editslug") as HTMLInputElement).value;
        const userID = (document.getElementById("edituserID") as HTMLInputElement).value;

        if (redirect === "") {
            alert("Please fill in all required fields");
            setLoadCreated(false);
            return;
        }

        await editLink(userID, slug, redirect);
        const links = await getLinks();
        setLinks(links);
        const hosts = await getHosts();
        setHost(hosts);
        setLoading(false);
        alert("Link edited successfully");
        setLoadCreated(false);
    };


    return (
        <>
            <div>
                <Button onPress={() => handleOpen("create")}>Create a Link</Button>
                {modalId === "create" && (
                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Create a Link</ModalHeader>
                                    <ModalBody>
                                        <form className="space-y-4 p-4 rounded-lg shadow-md" onSubmit={setLink}>
                                            <Tooltip content="Select the host you want to use">
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="host" className="text-xl font-semibold text-gray-100">
                                                        Host<p className='text-red-600 inline uppercase'>*</p>
                                                    </label>
                                                    <select id="host" name="host" required className="text-sm w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                                        <option value="" disabled selected>Select a host</option>
                                                        {getHost.map((host) => (
                                                            <option key={host.UUID} value={host.UUID}>{host.URL}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </Tooltip>

                                            <Tooltip content="Enter the URL you want to redirect to">
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="redirect" className="text-xl font-semibold text-gray-100">Redirect</label>
                                                    <input type="text" id="redirect" name="redirect" placeholder="Enter redirect URL" className="text-sm w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                                </div>
                                            </Tooltip>

                                            <Tooltip content="The slug for your redirect (e.g., linkr.li/your-slug)">
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="slug" className="text-xl font-semibold text-gray-100">Slug</label>
                                                    <input type="text" id="slug" name="slug" placeholder="Enter a custom slug" className="text-sm w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                                </div>
                                            </Tooltip>

                                            <input type="hidden" id="uuid" name="uuid" value={uuids} />
                                            <input type="hidden" id="userID" name="userID" value={UserID} />

                                            <ModalFooter>
                                                <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
                                                <Button type="submit" color="primary" variant="light">Create Redirect</Button>
                                            </ModalFooter>
                                        </form>
                                    </ModalBody>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                )}
            </div>



            {

                modalId === "edit" && (


                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex-col gap-1 inline">Edit <code className='inline text-gray-500'>{linksData.map((link) => (link.Slug))}</code></ModalHeader>
                                    <ModalBody>
                                        <form className="space-y-4 p-4 rounded-lg shadow-md" onSubmit={feditLink}>
                                            <Tooltip content="Enter the URL you want to redirect to">
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="editredirect" className="text-xl font-semibold text-gray-100">Redirect</label>
                                                    <input type="text" disabled={false}
                                                        id="editredirect" name="editredirect" placeholder="Enter redirect URL" className="text-sm w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                                </div>
                                            </Tooltip>
                                            <input type="hidden" id="edituserID" name="edituserID" value={UserID} />
                                            <input type="hidden" id="editslug" name="editslug" value={linksData.map((link) => (link.Slug))} />
                                            <ModalFooter>
                                                <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
                                                <Button type="submit" color="primary" variant="light">Edit Redirect</Button>
                                            </ModalFooter>
                                        </form>
                                    </ModalBody>
                                </>
                            )}
                        </ModalContent>
                    </Modal>


                )
            }



            <div className="grid grid-cols-3 gap-4 mt-10">
                {loading ? (
                    <Skeleton className="rounded-lg p-10 w-full h-full">
                        <Card className="max-w-[400px]">
                            <CardHeader className="flex gap-3"></CardHeader>
                            <Divider />
                            <CardBody></CardBody>
                            <Divider />
                            <CardFooter></CardFooter>
                        </Card>
                    </Skeleton>
                ) : (
                    <>
                        {linksData.map((link) => (
                            <Card className="max-w-[400px]">
                                <CardHeader className="flex gap-10">
                                    <h4 className="text-lg font-semibold">Link</h4>
                                    <div className='flex gap-2 ml-56 mr-3'>
                                        <Link className='' href={""} onClick={() => {
                                            fdeleteLink(link.UserID, link.Slug);
                                        }}>
                                            <Icon
                                                name='bx-trash'
                                                size='18px'

                                            />
                                        </Link>
                                        <Link href={""} onClick={() => {
                                            navigator.clipboard.writeText(
                                                getHost
                                                    .map((host) => (host.UUID === link.Host ? host.URL : null))
                                                    .filter((url) => url !== null)
                                                    .join('') + "/" + link.Slug
                                            );
                                        }}>
                                            <Icon
                                                name='bx-copy'
                                                size='18px'

                                            />
                                        </Link>
                                        <Link href={""} onClick={() => {
                                            handleOpen("edit");
                                        }}>
                                            <Icon
                                                name='bx-edit-alt'
                                                size='18px'

                                            />
                                        </Link>
                                    </div>
                                    <Spacer />
                                </CardHeader>
                                <Divider />
                                <CardBody>
                                    <h4 className="text-lg font-semibold">Slug</h4>
                                    <p>{link.Slug}</p>
                                    <h4 className="text-lg font-semibold">Redirect</h4>
                                    <p> <Link target='_blank' className='text-blue-300' href={link.Redirect}>{link.Redirect}</Link></p>
                                    <h4 className="text-lg font-semibold">URL</h4>
                                    <p>
                                        <Link target='_blank' className='text-blue-300' href={"http://" + getHost
                                            .map((host) => (host.UUID === link.Host ? host.URL : null))
                                            .filter((url) => url !== null)
                                            .join('') + "/" + link.Slug}>
                                            {getHost
                                                .map((host) => (host.UUID === link.Host ? host.URL : null))
                                                .filter((url) => url !== null)
                                                .join('') + "/" + link.Slug}</Link>
                                    </p>
                                    <h4 className="text-lg font-semibold">Host</h4>
                                    <p>{getHost.map((host) => (
                                        host.UUID === link.Host ? host.URL : null
                                    ))}</p>
                                </CardBody>
                                <Divider />
                                <CardFooter></CardFooter>
                            </Card>
                        ))}
                    </>
                )}
            </div>
        </>
    );
}
