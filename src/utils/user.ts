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


const PSEUD_AFTER = ", ";
export const getProfilePseuds = ($userProfile: UserProfile) => {
 const pseuds = $userProfile("dd.pseuds").text().concat(", ");
 return pseuds.slice(0, -PSEUD_AFTER.length);
}

//Dates are ten characters long in the following format:
const DATE_CONTENT = "0000-00-00";

//Trim the results to only the date:
export const getProfileJoined = ($userProfile: UserProfile) => {
 const dds = $userProfile(".meta dd:not(.email, .location, .birthday, .pseuds)").text();
 return dds.slice(0, DATE_CONTENT.length);
}

//Trim the results to only content after the date:
export const getProfileID = ($userProfile: UserProfile) => {
 const dds = $userProfile(".meta dd:not(.email):not(dt.location+dd):not(.birthday):not(.pseuds)").text();
 return dds.slice(DATE_CONTENT.length);
}

export const getProfilePic = ($userProfile: UserProfile) => {
 return $userProfile("img.icon").attr("src");
}

export const getProfileHeader = ($userProfile: UserProfile) => {
 return $userProfile("div.user.home.profile > h3.heading").text().trim();
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

//Constants for trimming the navigation menu content 

const STAT_SUFFIX = ")";
const WORKS_PREFIX = "Works (";
const SERIES_PREFIX = "Series (";
const BOOKMARKS_PREFIX = "Bookmarks (";
const COLLECTIONS_PREFIX = "Collections (";
const GIFTS_PREFIX = "Gifts (";

export const getProfileWorks = ($userProfile: UserProfile) => {
 return $userProfile("#dashboard a[href$='works']").text().trim().slice(WORKS_PREFIX.length, -STAT_SUFFIX.length);
}

export const getProfileSeries = ($userProfile: UserProfile) => {
 return $userProfile("#dashboard a[href$='series']").text().trim().slice(SERIES_PREFIX.length, -STAT_SUFFIX.length);
}

export const getProfileBookmarks = ($userProfile: UserProfile) => {
 return $userProfile("#dashboard a[href$='bookmarks']").text().trim().slice(BOOKMARKS_PREFIX.length, -STAT_SUFFIX.length);
}

export const getProfileCollections = ($userProfile: UserProfile) => {
 return $userProfile("#dashboard a[href$='collections']").text().trim().slice(COLLECTIONS_PREFIX.length, -STAT_SUFFIX.length);
}

export const getProfileGifts = ($userProfile: UserProfile) => {
 return $userProfile("#dashboard a[href$='gifts']").text().trim().slice(GIFTS_PREFIX.length, -STAT_SUFFIX.length);
}