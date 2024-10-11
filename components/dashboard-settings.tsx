"use client";
import { deleteUser, requireLogin } from '@/backend/actions';
import { Card, Button, Avatar, CardHeader, CardBody, CardFooter, Divider, Skeleton } from '@nextui-org/react';
import Image from "next/image";
import { useEffect, useState } from 'react';
const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2();
import { AUTHURL } from '@/config';
import Icon from './boxicon';

interface DashSettingsProps {
    UserID: string;
    Links: Array<any>;
    AccessToken: string;
    changeTab: (tab: string) => void;
}

interface APIUserData {
    Username: string;
    Avatar: string;
    Email: string;
    Banner: string;
    ID: string;
}


export function DashSettings({ UserID, Links, AccessToken, changeTab }: DashSettingsProps): JSX.Element {

    const [useAPIData, setAPIData] = useState<APIUserData | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function getAPIData() {
            const member = await oauth.getUser(AccessToken).catch(() => {
                return requireLogin(window.open(process.env.NETXAUTHURL, "_self"));
            })

            setAPIData(
                {
                    Username: member.username,
                    Avatar: member.avatar,
                    Email: member.email,
                    Banner: member.banner,
                    ID: member.id
                }
            );
            setLoading(false);

        }
        getAPIData();


    });


    const [deleteAccount, setDeleteAccount] = useState(false);

    async function confirmdeleteAccount() {
        await deleteUser(UserID).catch(() => {
            return requireLogin(window.open(process.env.NETXAUTHURL, "_self"));
        })
        return window.open(process.env.NEXTAPP_URL, "_self");
    }

    return (
        <>
            {
                loading ? (
                    <Skeleton className="rounded-lg p-10 mt-14 w-full h-full" >
                        <div className=''>
                            <Card className="max-w-[400px] ml-96">
                                <CardHeader className="flex gap-3">
                                </CardHeader>
                                <Divider />
                                <CardBody>
                                </CardBody>
                                <Divider />
                                <CardFooter>
                                </CardFooter>
                            </Card>
                        </div>
                    </Skeleton>
                ) : (
                    null)
            }



            {
                loading ? (
                    null)
                    : (
                        deleteAccount ? (
                            <div className='p-10'>
                                <Button
                                    suppressHydrationWarning={true}
                                    color='danger'
                                    onClick={() => { confirmdeleteAccount() }}
                                >
                                    <Icon name='bx-trash' size='18px' />
                                    Confirm Delete Account
                                </Button>
                            </div>
                        ) : (
                            <div className='p-10'>
                                <Button
                                    suppressHydrationWarning={true}
                                    color='danger'
                                    onClick={() => { setDeleteAccount(true) }}
                                >
                                    <Icon name='bx-trash' size='18px' />
                                    Delete Account
                                </Button>
                            </div>



                        )
                    )


            }


        </>
    );
}
