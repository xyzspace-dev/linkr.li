"use client";
import { useEffect, useState } from "react";
import { createCookie, deleteSession, getCookie, getSession, getUserData, hasCookie, requireLogin } from "../../backend/actions";
import { APP_URL, AUTHURL } from "../../config";
import { Spinner } from "@nextui-org/spinner";
import { Tabs, Tab, Chip, Button } from "@nextui-org/react";
import Icon from "@/components/boxicon";
import { DashHome } from "@/components/dashboard-home";
import { DashSettings } from "@/components/dashboard-settings";
import { DashAdmin } from "@/components/dashboard-admin";
import { DashLinks } from "@/components/dashboard-links";

interface UserData {
    UserID: string;
    UUID: string;
    Email: string;
    RefreshToken: string;
    AccessToken: string;
    Links: any[];
    Admin?: boolean;
}

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [currentTab, setCurrentTab] = useState("overview");

    const changeTab = (key: string) => {
        setCurrentTab(key);
    };

    async function logout() {
        const cookie = await getCookie().catch((err) => {
            return requireLogin(window.open(process.env.NETXAUTHURL, "_self"));
        });
        const member = await getUserData(cookie?.value).catch((err) => {
            return requireLogin(window.open(process.env.NETXAUTHURL, "_self"));
        });

        await deleteSession(userData?.UserID);
        return window.open(process.env.NEXTAPP_URL, "_self");
    }



    useEffect(() => {
        async function checkAuth() {


            if (await hasCookie()) {
                const cookie = await getCookie().catch((err) => {
                    return requireLogin(window.open(process.env.NETXAUTHURL, "_self"));
                });


                if (!cookie) {
                    return requireLogin(window.open(process.env.NETXAUTHURL, "_self"));
                }



                const session = await getSession(cookie?.value).catch((err) => {
                    return requireLogin(window.open(process.env.NETXAUTHURL, "_self"));
                });
                if (!session) {
                    return requireLogin(window.open(process.env.NETXAUTHURL, "_self"));

                }

                try {
                    const cookie = await getCookie().catch((err) => {
                        return requireLogin(window.open(process.env.NETXAUTHURL, "_self"));
                    });
                    const user = await getUserData(cookie?.value).catch((err) => {
                        return requireLogin(window.open(process.env.NETXAUTHURL, "_self"));
                    });



                    if (!user || !user.UUID) {
                        return requireLogin(window.open(process.env.NETXAUTHURL, "_self"));
                    } else {
                        // HERE!
                        setUserData({
                            UserID: user?.UserID,
                            UUID: user?.UUID,
                            Email: user?.Email,
                            RefreshToken: user?.RefreshToken,
                            AccessToken: user?.AccessToken,
                            Links: user?.Links,
                            Admin: user?.Admin
                        });

                    }
                } catch (err) {
                    return requireLogin(window.open(process.env.NETXAUTHURL, "_self"));
                } finally {
                    setLoading(false);
                }

            } else {
                return requireLogin(window.open(process.env.NETXAUTHURL, "_self"));
            }
        }
        checkAuth();
    }, []);

    while (loading) {
        return (
            <div className="flex justify-center w-full h-96 items-center">
                <Spinner label="Loading..." color="warning" />
            </div>
        );
    }

    async function copyData() {
        const cookie = await getCookie()
        await createCookie(cookie?.value)

        const url = process.env.NEXTAPP_URL
        navigator.clipboard.writeText(btoa(JSON.stringify({ cookie: cookie?.value, url: url })))
    }
    return (
        <>
            <nav>
                <div className="flex w-full flex-col">
                    <div className="ml-auto inline">

                        <Button onClick={() => (logout())}>
                            <Icon name="bx-log-out" size="18px" />
                            Logout
                        </Button>
                        <p className="inline ml-3"></p>

                        {/* onClick={() => (copyData())} */}
                        <Button
                            suppressHydrationWarning={true}
                            disabled
                        >
                            <Icon name="bx-copy" size="18px" />
                            Extension Login
                        </Button>


                    </div>
                    <Tabs
                        aria-label="Options"
                        color="primary"
                        variant="underlined"
                        selectedKey={currentTab}
                        onSelectionChange={(key) => setCurrentTab(key.toString())}
                        classNames={{
                            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                            cursor: "w-full bg-[#22d3ee]",
                            tab: "max-w-fit px-0 h-12",
                            tabContent: "group-data-[selected=true]:text-[#06b6d4]"
                        }}
                    >
                        <Tab
                            key="overview"
                            onClick={() => changeTab("overview")}
                            shouldSelectOnPressUp
                            title={
                                <div className="flex items-center space-x-2">
                                    <Icon name="bx-home" size="18px" />
                                    <span>Overview</span>
                                </div>
                            }
                        >
                            <DashHome
                                UserID={userData?.UserID ?? ""}
                                Links={userData?.Links ?? []}
                                AccessToken={userData?.AccessToken ?? ""}
                                changeTab={changeTab}
                            />
                        </Tab>
                        <Tab
                            key="links"
                            onClick={() => changeTab("links")}
                            title={
                                <div className="flex items-center space-x-2">
                                    <Icon name="bx-link" size="18px" />
                                    <span>Links</span>
                                    <Chip size="sm" variant="faded">{userData?.Links.length}</Chip>
                                </div>
                            }
                        >

                            <DashLinks
                                UserID={userData?.UserID ?? ""}
                                UUID={userData?.UUID ?? ""}
                                changeTab={changeTab}
                                Links={userData?.Links ?? []}
                            />

                        </Tab>
                        <Tab
                            key="setting"
                            onClick={() => changeTab("setting")}
                            title={
                                <div className="flex items-center space-x-2">
                                    <Icon name="bx-cog" size="18px" />
                                    <span>Setting</span>

                                </div>
                            }
                        >



                            <DashSettings
                                UserID={userData?.UserID ?? ""}
                                Links={userData?.Links ?? []}
                                AccessToken={userData?.AccessToken ?? ""}
                                changeTab={changeTab}
                            />
                        </Tab>
                        {
                            process.env.NEXTADMINID == userData?.UserID ? (
                                <Tab
                                    key="admin"
                                    onClick={() => changeTab("admin")}
                                    title={
                                        <div className="flex items-center space-x-2 text-gray-500">
                                            <Icon name="bx-command" size="18px" />
                                            <span>Hosts</span>

                                        </div>
                                    }
                                >
                                    <DashAdmin
                                        UserID={userData?.UserID ?? ""}
                                        Links={userData?.Links ?? []}
                                        AccessToken={userData?.AccessToken ?? ""}
                                        changeTab={changeTab}
                                        isAdmin={process.env.NEXTADMINID == userData?.UserID ? true : false}
                                    />
                                </Tab>
                            ) : null



                        }

                        {userData?.Admin ? (

                            <Tab
                                key="admin"
                                onClick={() => changeTab("admin")}
                                title={
                                    <div className="flex items-center space-x-2 text-gray-500">
                                        <Icon name="bx-command" size="18px" />
                                        <span>Hosts</span>

                                    </div>
                                }
                            >
                                <DashAdmin
                                    UserID={userData?.UserID ?? ""}
                                    Links={userData?.Links ?? []}
                                    AccessToken={userData?.AccessToken ?? ""}
                                    changeTab={changeTab}
                                    isAdmin={userData?.Admin ?? false}
                                />
                            </Tab>
                        ) : null}


                    </Tabs>


                </div>
            </nav>
        </>
    );
}
