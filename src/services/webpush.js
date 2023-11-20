import webpush from 'web-push';

// const vapidKeys = webpush.generateVAPIDKeys();

// VAPID keys should only be generated only once.

export const sendNotification = () => {
    const vapidKeys = {
        publicKey:
            'BBZY7Q3KEtZArAAWMLi_qzWHbH4vAoqPpIXnRhmlUaw0PVs1Kt_2fgLhuaVI5i8MWASBKx3d6W6UoH2U3qChw9U',
        privateKey: 'CZtf_JUxmXkCKbzwaKedPPO9BFC99U2rk-GUYDbYAa8'
    };

    webpush.setVapidDetails(
        'mailto:example@yourdomain.org',
        vapidKeys.publicKey,
        vapidKeys.privateKey
    );

    // This is the same output of calling JSON.stringify on a PushSubscription
    const pushSubscription = {
        "endpoint":"https://wns2-bl2p.notify.windows.com/w/?token=BQYAAAAT2PK0VjEgjfqf%2f7xZk44JdgXY2agn41KlRprKakaCqArYP4sSmxJkPnrJX8LVfagCuyNMp5EyBwZg3vF1Ym1nMpa6CByhmq1w6KqmWVhPUHXEBACaNO5EpDEcuJZVgAv3LXnWs7VD3jMGDPoHG0UKBp7Mskj0%2bTYN0peDvItYftkvRDTfPjT8FRkbzMipmOlWRIC78QqrHXi22A14kBrWwnNaDLX2IyH%2bPsUeu4mfOq6GnZLwDXavVR%2fDSyb8Xc7nasMJSM0W64tkg30NSp0pkzYFeq%2bUABZ5zG1VcDwnibvNaDbpxolPCDzBmr3afsI%3d",
        "expirationTime":null,
        "keys":{
            "p256dh":"BNeAFWi089O-7QHeyNUibvy8o6m2h8cKArs87tjq6y24xezk4wua4pr1qu0j9caTPRRD7Js4E4xYuYSCwtqz02U",
            "auth":"jw5haOd0OWxcFzbUTzoFNg"
        }
    }
    webpush.sendNotification(pushSubscription, 'Your Push Payload Text');
}