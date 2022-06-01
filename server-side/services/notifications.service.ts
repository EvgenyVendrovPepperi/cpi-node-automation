import { PapiClient, FindOptions } from "@pepperi-addons/papi-sdk";
import { Client } from "@pepperi-addons/debug-server";

export interface Notification {
  ModificationDateTime?: string;
  Read?: boolean;
  CreationDateTime?: string;
  Body: string;
  Title: string;
  Hidden?: boolean;
  CreatorUUID?: string;
  UserUUID?: string;
  Email?: string;
  Key?: string;
}

export interface bulkNotification {
  UserEmailList: string[];
  Title: string;
  Body: string;
}

export interface negativeNotification {
  Title?: any;
  Body?: any;
  UserUUID?: any;
  Read?: any;
  Email?: any;
}

export interface userDevice {
  Key?: string;
  UserUUID?: string;
  AppKey: string;
  AppName: string;
  DeviceKey: string;
  DeviceName: string;
  DeviceType: string;
  PlatformType?: string;
  Token: string; // should be incrypted
  AddonRelativeURL?: string;
  Hidden?: boolean;
  ModificationDateTime?: string;
  CreationDateTime?: string;
  ExpirationDateTime?: string;
}

export interface negativeUserDevice {
  Key?: string;
  UserUUID?: string;
  AppKey?: string;
  AppName?: string;
  DeviceKey?: string;
  DeviceName?: string;
  DeviceType?: string;
  PlatformType?: string;
  Token?: string; // should be incrypted
  AddonRelativeURL?: string;
  Hidden?: boolean;
  ModificationDateTime?: string;
  CreationDateTime?: string;
  ExpirationDateTime?: string;
}

class NotificationService {
  papiClient: PapiClient;

  constructor(private client: Client) {
    this.papiClient = new PapiClient({
      baseURL: client.BaseURL,
      token: client.OAuthAccessToken,
      addonSecretKey: client.AddonSecretKey,
      addonUUID: client.AddonUUID,
    });
  }

  async markAsRead(body: any): Promise<Notification[]> {
    const res = await this.papiClient.post(
      `/addons/api/95025423-9096-4a4f-a8cd-d0a17548e42e/api/update_notifications_read_status`,
      body
    );
    //   `/notifications/update_notifications_read_status`
    return res;
  }

  async postNotifications(body: Notification): Promise<Notification> {
    const res = await this.papiClient.post(`/notifications`, body);
    return res;
  }

  async postBulkNotification(object: bulkNotification) {
    const res = await this.papiClient.post(
      `/addons/api/95025423-9096-4a4f-a8cd-d0a17548e42e/api/bulk_notifications`,
      object
    );
    return res;
  }

  async postNotificationsNegative(body: any): Promise<any> {
    const res = await this.papiClient.post(`/notifications`, body);
    return res;
  }

  async getAllNotifications(): Promise<Notification[]> {
    const res = await this.papiClient.get(`/notifications`);
    return res;
  }

  async getNotificationssWithFindOptions(
    findOptions: FindOptions
  ): Promise<Notification[]> {
    let url = `/notifications?`;
    const obj = findOptions;
    for (const [key, value] of Object.entries(obj)) {
      url.includes("=")
        ? (url = url + `&${key}=${value.toString()}`)
        : (url = url + `${key}=${value.toString()}`);
    }
    const res = await this.papiClient.get(url);
    return res;
  }
  //not working at the moment
  async getNotificationByKey(key: string): Promise<Notification> {
    const res = await this.papiClient.get(`/notifications?where=Key='${key}'`);
    return res;
  }

  async generateRandomNotification(userExID?: string): Promise<Notification> {
    const userKey = userExID ? userExID : "TEST";
    const user = await this.papiClient.users.find({
      where: `ExternalID='${userKey}'`, // a user with this ID should be created on addons intall
    });
    const userUUID = user[0].UUID as string;
    const titleIndex = Math.floor(Math.random() * 3) + 1; //two indexes to randomize the key combinations more
    const bodyIndex = Math.floor(Math.random() * 3) + 1;
    const titleArr = [
      "IamIronMan",
      "Earth_is_closed_today_squeedwerd",
      "will_power_something_big",
      "we_conected",
    ];
    const bodyArr = [
      "Playboy_Billionaire_Genius_Philanthrophist",
      "Im_getting_the_door_for_you",
      "you_brought_pizza",
      "this_is_nice",
    ];
    return {
      UserUUID: userUUID,
      Title: titleArr[titleIndex],
      Body: bodyArr[bodyIndex],
    } as Notification;
  }

  async generateRandomNotificationWithEmail(
    userExID?: string
  ): Promise<Notification> {
    const userKey = userExID ? userExID : "TEST";
    const user = await this.papiClient.users.find({
      where: `ExternalID='${userKey}'`, // a user with this ID should be created on addons intall
    });
    const email = user[0].Email as string;
    const titleIndex = Math.floor(Math.random() * 3) + 1; //two indexes to randomize the key combinations more
    const bodyIndex = Math.floor(Math.random() * 3) + 1;
    const titleArr = [
      "IamIronMan",
      "Earth_is_closed_today_squeedwerd",
      "will_power_something_big",
      "we_conected",
    ];
    const bodyArr = [
      "Playboy_Billionaire_Genius_Philanthrophist",
      "Im_getting_the_door_for_you",
      "you_brought_pizza",
      "this_is_nice",
    ];
    return {
      Email: email,
      Title: titleArr[titleIndex],
      Body: bodyArr[bodyIndex],
    } as Notification;
  }
  //next version
  async generateRandomBulkNotifications(): Promise<bulkNotification> {
    const users = await this.papiClient.users.find({
      where: `Hidden=false`,
    });
    const usersArr: string[] = [];
    for (const user of users) {
      if (user.Email) {
        usersArr.push(user.Email);
      }
    }
    return {
      UserEmailList: usersArr,
      Title:
        Math.random() > 0.5
          ? "Bulk_Tony_stark_is_awesome"
          : "Bulk_Iron_man_is_awesome",
      Body:
        Math.random() > 0.5
          ? "Hulk-Buster_or_Silver_centurion?"
          : "Nano_armor_ofcourse",
    };
  }
  //generates notifications for negative test
  async generateNegativeNotification(
    testCase: string,
    UserUUID?: string,
    email?: string
  ): Promise<any> {
    const userUUID = UserUUID ? UserUUID : null;
    const userEmail = email ? email : null;
    const negativeNotification: negativeNotification = {
      UserUUID: userUUID,
      Title:
        Math.random() > 0.5
          ? "I am Iron Man"
          : "Earth is closed today squeedwerd!",
      Body:
        Math.random() > 0.5
          ? "Playboy,Billionaire,Genius,Philanthrophist"
          : "This is not a hug,I'm getting the door for you",
    };
    switch (testCase) {
      case "Title-removed":
        delete negativeNotification.Title;
        break;
      case "Title-number":
        negativeNotification.Title = Math.random() * 100;
        break;
      case "Body-removed":
        delete negativeNotification.Body;
        break;
      case "Body-number":
        negativeNotification.Body = Math.random() * 100;
        break;
      case "User-removed":
        delete negativeNotification.UserUUID;
        break;
      case "User-number":
        negativeNotification.UserUUID = Math.random() * 100;
        break;
      case "all-wrong":
        negativeNotification.Body = Math.random() * 100;
        negativeNotification.Title = Math.random() * 100;
        negativeNotification.UserUUID = Math.random() * 100;
        break;
      case "longTitle":
        for (let i = 0; i < 10; i++) {
          negativeNotification.Title += negativeNotification.Title;
        }
        break;
      case "longBody":
        for (let i = 0; i < 10; i++) {
          negativeNotification.Body += negativeNotification.Body;
        }
        break;
      case "wrong-email":
        negativeNotification.Email = userEmail?.split(".co")[0];
        delete negativeNotification.UserUUID;
        break;
      case "uuid-email":
        negativeNotification.Email = userEmail;
        break;
    }

    return negativeNotification;
  }
  //temp to replace getByKey
  async getNotificationByKeyTemp(key: string): Promise<Notification> {
    const allNotifications = await this.getAllNotifications();
    let res = allNotifications.filter(
      (notification) => notification.Key === key
    );
    return res[0];
  }

  async postUserDevice(body: userDevice): Promise<userDevice> {
    const res = await this.papiClient.post(
      `/addons/api/95025423-9096-4a4f-a8cd-d0a17548e42e/api/user_devices`,
      body
    );
    return res;
  }

  async getUserDevice(): Promise<userDevice> {
    const res = await this.papiClient.get(
      `/addons/api/95025423-9096-4a4f-a8cd-d0a17548e42e/api/user_devices`
    );
    return res;
  }

  async getUserDeviceByKey(key: string): Promise<userDevice> {
    const res = await this.papiClient.get(
      `/addons/api/95025423-9096-4a4f-a8cd-d0a17548e42e/api/user_devices?where=Key='${key}'`
    );
    return res;
  }

  async generateUserDevice(
    userExID?: string,
    hidden?: boolean,
    AddonRelativeURL?: string
  ): Promise<userDevice> {
    const userKey = userExID ? userExID : "TEST";
    const URL = AddonRelativeURL
      ? AddonRelativeURL
      : "/addons/api/2b39d63e-0982-4ada-8cbb-737b03b9ee58/api/notificationsLogger";
    const hiddenFlag = hidden ? hidden : false;
    // const user = await this.papiClient.users.find({
    //   where: `ExternalID='${userKey}'`, // a user with this ID should be created on addons intall
    // });
    // const userUUID = user[0].UUID as string;
    return {
      AppKey: "com.wrnty.peppery",
      DeviceKey: `random-device_${Math.floor(Math.random() * 1000)}`,
      DeviceName: `test-name_${Math.floor(Math.random() * 1000)}`,
      Token: `random-token_${Math.floor(Math.random() * 1000)}`,
      AppName: "Pepperi",
      DeviceType: "Test",
      PlatformType: "Addon",
      AddonRelativeURL: URL, // logger endpoint on this addon to get the notification and post to ADAL
      Hidden: hiddenFlag,
    };
  }

  async generateBulkUserDevice(): Promise<userDevice[]> {
    const users = await this.papiClient.users.find({
      where: `Hidden=false`,
    });
    const userDeviceArr: userDevice[] = [];

    for (const user of users) {
      userDeviceArr.push({
        AppKey: "com.wrnty.peppery",
        DeviceKey: `random-device_${Math.floor(Math.random() * 1000)}`,
        DeviceName: `test-name_${user.UUID}`,
        Token: `random-token_${Math.floor(Math.random() * 1000)}`,
        AppName: "Pepperi",
        DeviceType: "Test",
        PlatformType: "Addon",
        AddonRelativeURL:
          "/addons/api/2b39d63e-0982-4ada-8cbb-737b03b9ee58/api/bulkNotificationsLogger", // logger endpoint on this addon to get the notification and post to ADAL
        Hidden: false,
      });
    }

    return userDeviceArr;
  }

  async postNegativeUserDevice(body: any): Promise<any> {
    const res = await this.papiClient.post(
      `/addons/api/95025423-9096-4a4f-a8cd-d0a17548e42e/api/user_devices`,
      body
    );
    return res;
  }
  //need to do after talking to Chasky
  async generateNegativeUserDevice(testCase: string): Promise<any> {
    const userDevice = {
      AppKey: "com.wrnty.peppery",
      DeviceKey: `random-device ${Math.floor(Math.random() * 1000)}`,
      DeviceName: `test-name ${Math.floor(Math.random() * 1000)}`,
      Token: `random-token ${Math.floor(Math.random() * 1000)}`,
      AppName: "Pepperi",
      DeviceType: "Test",
      PlatformType: "Addon",
      AddonRelativeURL:
        "/addons/api/2b39d63e-0982-4ada-8cbb-737b03b9ee58/api/notificationsLogger", // logger endpoint on this addon to get the notification and post to ADAL
      Hidden: false,
    } as negativeUserDevice;

    switch (testCase) {
      case "no-app-key":
        delete userDevice.AppKey;
        break;
      case "no-device-key":
        delete userDevice.DeviceKey;
        break;
      case "no-device-name":
        delete userDevice.DeviceName;
        break;
    }
  }
}

export default NotificationService;

//uuid - email
//011dfeb3-7dea-407e-b948-e6b6af38c622 - notifications2@pepperitest.com
//5d0f6008-bfc4-4c73-8d64-e164bab730ef - notifications3@pepperitest.com
//6ddec9b8-1b2d-4333-a400-47874c60761b - laboris5490.amet@pepperitest.com
//81d159cf-716d-4e5a-8828-b4938902f726 - notifications@pepperitest.com