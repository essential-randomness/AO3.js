import cheerio, { CheerioAPI } from "cheerio";

import axios from "axios";

interface UserProfile extends CheerioAPI {
  kind: "UserProfile";
}

export interface User {
 id: string;
 name: string;
 pseuds: string;
 url: string;
 icon: string;
 header: string | null;
 joined: string;
 location: string | null;
 email: string | null;
 birthday: string | null;
 works: string | null;
 series: string | null;
 bookmarks: string | null;
 collections: string | null;
 gifts: string | null;
 bioHtml: string | null;
}

export const getProfileLink = (userName: string) =>
  `https://archiveofourown.org/users/${encodeURI(userName)}/profile`;

export const getProfile = async (userName: string) => {
  return cheerio.load(
    (await axios.get<string>(getProfileLink(userName))).data
  ) as UserProfile;
};

export const getProfileName = ($userProfile: UserProfile) => {
 return $userProfile(".user.profile .header h2").text().trim();
} 

export const getProfilePseuds = ($userProfile: UserProfile) => {
 const pseuds = $userProfile("dd.pseuds").text().concat(", ");
 return pseuds.slice(0, -2);
}
// slice here prevents pseuds from getting an extra ", " at the end 

export const getProfileJoined = ($userProfile: UserProfile) => {
 const dds = $userProfile(".meta dd:not(.email, .location, .birthday, .pseuds)").text();
 return dds.slice(0, 10);
}
//slice here cuts the date off before it would run into the user ID
export const getProfileID = ($userProfile: UserProfile) => {
 const dds = $userProfile(".meta dd:not(.email):not(dt.location+dd):not(.birthday):not(.pseuds)").text();
 return dds.slice(10);
}

export const getProfilePic = ($userProfile: UserProfile) => {
 return $userProfile("img.icon").attr("src");
}

export const getProfileHeader = ($userProfile: UserProfile) => {
 return $userProfile("h3.heading").text().trim().slice(15, -9);
}

export const getProfileBio = ($userProfile: UserProfile) => {
 return $userProfile(".userstuff").html();
}

export const getProfileEmail = ($userProfile: UserProfile) => {
 return $userProfile("dd.email").text();
}

export const getProfileLocation = ($userProfile: UserProfile) => {
 return $userProfile("dt.location+dd").text();
}

export const getProfileBday = ($userProfile: UserProfile) => {
 return $userProfile("dd.birthday").text();
}

//TODO: Pull information (Works/Series/Bookmarks/Collections/Gifts) from navigation actions maybe?

export const getProfileWorks = ($userProfile: UserProfile) => {
 return $userProfile("#dashboard a[href$='works']").text().trim().slice(7, -1);
}

export const getProfileSeries = ($userProfile: UserProfile) => {
 return $userProfile("#dashboard a[href$='series']").text().trim().slice(8, -1);
}

export const getProfileBookmarks = ($userProfile: UserProfile) => {
 return $userProfile("#dashboard a[href$='bookmarks']").text().trim().slice(11, -1);
}

export const getProfileCollections = ($userProfile: UserProfile) => {
 return $userProfile("#dashboard a[href$='collections']").text().trim().slice(13, -1);
}

export const getProfileGifts = ($userProfile: UserProfile) => {
 return $userProfile("#dashboard a[href$='gifts']").text().trim().slice(7, -1);
}