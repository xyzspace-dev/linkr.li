"use client";
import { useEffect, useState } from "react";
import { getCookie, getSession, getUserData, requireLogin } from "../../backend/actions";
import { AUTHURL } from "../../config.json";
import { Spinner } from "@nextui-org/spinner";
import { Tabs, Tab, Chip } from "@nextui-org/react";
import Icon from "@/components/boxicon";
import { DashHome } from "@/components/dashboard-home";

interface UserData {
    UserID: string;
    UUID: string;
    Email: string;
    RefreshToken: string;
    AccessToken: string;
    Links: any[];
}

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [currentTab, setCurrentTab] = useState("overview");

    const changeTab = (key: string) => {
        setCurrentTab(key);
    };


    useEffect(() => {
        async function checkAuth() {
            if (await getCookie()) {
                const cookie = await getCookie().catch((err) => {
                    return requireLogin(window.open(AUTHURL, "_self"));
                });
                const session = await getSession(cookie?.value).catch((err) => {
                    return requireLogin(window.open(AUTHURL, "_self"));
                });
                if (!session) {
                    window.open(AUTHURL, "_self");
                }
                setLoading(false);
            } else {
                window.open(AUTHURL, "_self");
            }
        }
        checkAuth();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const cookie = await getCookie().catch((err) => {
                    return requireLogin(window.open(AUTHURL, "_self"));
                });
                const user = await getUserData(cookie?.value).catch((err) => {
                    return requireLogin(window.open(AUTHURL, "_self"));
                });
                if (!user || !user.UUID) {
                    requireLogin(window.open(AUTHURL, "_self"));
                } else {
                    setUserData({
                        UserID: user?.UserID,
                        UUID: user?.UUID,
                        Email: user?.Email,
                        RefreshToken: user?.RefreshToken,
                        AccessToken: user?.AccessToken,
                        Links: user?.Links,
                    });
                }
            } catch (err) {
                requireLogin(window.open(AUTHURL, "_self"));
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    while (loading) {
        return (
            <div className="flex justify-center w-full h-96 items-center">
                <Spinner label="Loading..." color="warning" />
            </div>
        );
    }

    return (
        <>
            <nav>
                <div className="flex w-full flex-col">
                    <Tabs
                        aria-label="Options"
                        color="primary"
                        variant="underlined"
                        selectedKey={currentTab}
                        // Fix the type of onSelectionChange
                        onSelectionChange={setCurrentTab}
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
                            <DashHome changeTab={changeTab} AccessToken={userData?.AccessToken as string} Links={userData?.Links as [string]} UserID={userData?.UserID as string} />
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
                        </Tab>
                    </Tabs>
                </div>
            </nav>
        </>
    );
}
