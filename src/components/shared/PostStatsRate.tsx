import {
  useGetCurrentUser,
  useLikePost,
} from "@/lib/react-query/queriesAndMutations";
import type { Post} from "@/types";
import { useEffect, useState } from "react";

import { getLikes } from "@/lib/appwrite/api";

import EmojiBar from "./EmojiBar";
import Ejimo1 from "./EjimosEmoji/Ejimo1";
import Ejimo2 from "./EjimosEmoji/Ejimo2";
import Ejimo3 from "./EjimosEmoji/Ejimo3";
import Ejimo4 from "./EjimosEmoji/Ejimo4";
import Ejimo5 from "./EjimosEmoji/Ejimo5";
import Ejimo6 from "./EjimosEmoji/Ejimo6";
import Ejimo7 from "./EjimosEmoji/Ejimo7";
import Ejimo8 from "./EjimosEmoji/Ejimo8";
import Ejimo9 from "./EjimosEmoji/Ejimo9";
import Ejimo10 from "./EjimosEmoji/Ejimo10";
import Ejimo11 from "./EjimosEmoji/Ejimo11";
import Ejimo12 from "./EjimosEmoji/Ejimo12";
import Ejimo13 from "./EjimosEmoji/Ejimo13";
import Ejimo14 from "./EjimosEmoji/Ejimo14";
import Ejimo15 from "./EjimosEmoji/Ejimo15";
import Ejimo16 from "./EjimosEmoji/Ejimo16";
import Ejimo17 from "./EjimosEmoji/Ejimo17";
import Ejimo18 from "./EjimosEmoji/Ejimo18";
import Ejimo19 from "./EjimosEmoji/Ejimo19";
import Ejimo20 from "./EjimosEmoji/Ejimo20";
import Ejimo21 from "./EjimosEmoji/Ejimo21";
import Ejimo22 from "./EjimosEmoji/Ejimo22";
import Ejimo23 from "./EjimosEmoji/Ejimo23";
import Ejimo24 from "./EjimosEmoji/Ejimo24";
import Ejimo25 from "./EjimosEmoji/Ejimo25";
import Ejimo26 from "./EjimosEmoji/Ejimo26";
import Ejimo27 from "./EjimosEmoji/Ejimo27";
import Ejimo28 from "./EjimosEmoji/Ejimo28";
import Ejimo29 from "./EjimosEmoji/Ejimo29";
import Ejimo30 from "./EjimosEmoji/Ejimo30";
import Ejimo31 from "./EjimosEmoji/Ejimo31";
import Ejimo32 from "./EjimosEmoji/Ejimo32";
import Ejimo33 from "./EjimosEmoji/Ejimo33";
import Ejimo34 from "./EjimosEmoji/Ejimo34";
import Ejimo35 from "./EjimosEmoji/Ejimo35";
import Ejimo36 from "./EjimosEmoji/Ejimo36";
import Ejimo37 from "./EjimosEmoji/Ejimo37";
import Ejimo38 from "./EjimosEmoji/Ejimo38";
import Ejimo39 from "./EjimosEmoji/Ejimo39";
import Ejimo40 from "./EjimosEmoji/Ejimo40";
import Ejimo41 from "./EjimosEmoji/Ejimo41";
import Ejimo42 from "./EjimosEmoji/Ejimo42";
import Ejimo43 from "./EjimosEmoji/Ejimo43";
import Ejimo44 from "./EjimosEmoji/Ejimo44";
import Ejimo45 from "./EjimosEmoji/Ejimo45";
import Ejimo46 from "./EjimosEmoji/Ejimo46";
import Ejimo47 from "./EjimosEmoji/Ejimo47";
import Ejimo48 from "./EjimosEmoji/Ejimo48";
import Ejimo49 from "./EjimosEmoji/Ejimo49";
import Ejimo50 from "./EjimosEmoji/Ejimo50";
import Ejimo51 from "./EjimosEmoji/Ejimo51";
import Ejimo52 from "./EjimosEmoji/Ejimo52";
import Ejimo53 from "./EjimosEmoji/Ejimo53";
import Ejimo54 from "./EjimosEmoji/Ejimo54";
import Ejimo55 from "./EjimosEmoji/Ejimo55";
import Ejimo56 from "./EjimosEmoji/Ejimo56";
import Ejimo57 from "./EjimosEmoji/Ejimo57";
import Ejimo58 from "./EjimosEmoji/Ejimo58";
import Ejimo59 from "./EjimosEmoji/Ejimo59";
import Ejimo60 from "./EjimosEmoji/Ejimo60";
import Ejimo61 from "./EjimosEmoji/Ejimo61";
import Ejimo62 from "./EjimosEmoji/Ejimo62";
import Ejimo63 from "./EjimosEmoji/Ejimo63";
import Ejimo64 from "./EjimosEmoji/Ejimo64";
import Ejimo65 from "./EjimosEmoji/Ejimo65";
import Ejimo66 from "./EjimosEmoji/Ejimo66";
import Ejimo67 from "./EjimosEmoji/Ejimo67";
import Ejimo68 from "./EjimosEmoji/Ejimo68";
import Ejimo69 from "./EjimosEmoji/Ejimo69";
import Ejimo70 from "./EjimosEmoji/Ejimo70";
import Ejimo71 from "./EjimosEmoji/Ejimo71";
import Ejimo72 from "./EjimosEmoji/Ejimo72";
import Ejimo73 from "./EjimosEmoji/Ejimo73";
import Ejimo74 from "./EjimosEmoji/Ejimo74";
import Ejimo75 from "./EjimosEmoji/Ejimo75";
import Ejimo76 from "./EjimosEmoji/Ejimo76";
import Ejimo77 from "./EjimosEmoji/Ejimo77";
import Ejimo78 from "./EjimosEmoji/Ejimo78";
import Ejimo79 from "./EjimosEmoji/Ejimo79";
import Ejimo80 from "./EjimosEmoji/Ejimo80";
import Ejimo81 from "./EjimosEmoji/Ejimo81";
import Ejimo82 from "./EjimosEmoji/Ejimo82";
import Ejimo83 from "./EjimosEmoji/Ejimo83";
import Ejimo84 from "./EjimosEmoji/Ejimo84";
import Ejimo85 from "./EjimosEmoji/Ejimo85";
import Ejimo86 from "./EjimosEmoji/Ejimo86";
import Ejimo87 from "./EjimosEmoji/Ejimo87";
import Ejimo88 from "./EjimosEmoji/Ejimo88";
import Ejimo89 from "./EjimosEmoji/Ejimo89";
import Ejimo90 from "./EjimosEmoji/Ejimo90";
import Ejimo91 from "./EjimosEmoji/Ejimo91";
import Ejimo92 from "./EjimosEmoji/Ejimo92";
import Ejimo93 from "./EjimosEmoji/Ejimo93";
import Ejimo94 from "./EjimosEmoji/Ejimo94";
import Ejimo95 from "./EjimosEmoji/Ejimo95";
import Ejimo96 from "./EjimosEmoji/Ejimo96";
import Ejimo97 from "./EjimosEmoji/Ejimo97";
import Ejimo98 from "./EjimosEmoji/Ejimo98";
import Ejimo99 from "./EjimosEmoji/Ejimo99";
import Ejimo100 from "./EjimosEmoji/Ejimo100";
import Ejimo101 from "./EjimosEmoji/Ejimo101";
import Ejimo102 from "./EjimosEmoji/Ejimo102";
import Ejimo103 from "./EjimosEmoji/Ejimo103";
import Ejimo104 from "./EjimosEmoji/Ejimo104";
import Ejimo105 from "./EjimosEmoji/Ejimo105";
import Ejimo106 from "./EjimosEmoji/Ejimo106";
import Ejimo107 from "./EjimosEmoji/Ejimo107";
import Ejimo108 from "./EjimosEmoji/Ejimo108";
import Ejimo109 from "./EjimosEmoji/Ejimo109";
import Ejimo110 from "./EjimosEmoji/Ejimo110";
import Ejimo111 from "./EjimosEmoji/Ejimo111";
import Ejimo112 from "./EjimosEmoji/Ejimo112";
import Ejimo113 from "./EjimosEmoji/Ejimo113";
import Ejimo114 from "./EjimosEmoji/Ejimo114";
import Ejimo115 from "./EjimosEmoji/Ejimo115";
import Ejimo116 from "./EjimosEmoji/Ejimo116";
import Ejimo117 from "./EjimosEmoji/Ejimo117";
import Ejimo118 from "./EjimosEmoji/Ejimo118";
import Ejimo119 from "./EjimosEmoji/Ejimo119";
import Ejimo120 from "./EjimosEmoji/Ejimo120";
import Ejimo121 from "./EjimosEmoji/Ejimo121";
import Ejimo122 from "./EjimosEmoji/Ejimo122";
import Ejimo123 from "./EjimosEmoji/Ejimo123";
import Ejimo124 from "./EjimosEmoji/Ejimo124";
import Ejimo125 from "./EjimosEmoji/Ejimo125";
import Ejimo126 from "./EjimosEmoji/Ejimo126";
import Ejimo127 from "./EjimosEmoji/Ejimo127";
import Ejimo128 from "./EjimosEmoji/Ejimo128";
import Ejimo129 from "./EjimosEmoji/Ejimo129";
import Ejimo130 from "./EjimosEmoji/Ejimo130";
import Ejimo131 from "./EjimosEmoji/Ejimo131";
import Ejimo132 from "./EjimosEmoji/Ejimo132";
import Ejimo133 from "./EjimosEmoji/Ejimo133";
import Ejimo134 from "./EjimosEmoji/Ejimo134";
import Ejimo135 from "./EjimosEmoji/Ejimo135";
import Ejimo136 from "./EjimosEmoji/Ejimo136";
import Ejimo137 from "./EjimosEmoji/Ejimo137";
import Ejimo138 from "./EjimosEmoji/Ejimo138";
import Ejimo139 from "./EjimosEmoji/Ejimo139";
import Ejimo140 from "./EjimosEmoji/Ejimo140";
import Ejimo141 from "./EjimosEmoji/Ejimo141";
import Ejimo142 from "./EjimosEmoji/Ejimo142";
import Ejimo143 from "./EjimosEmoji/Ejimo143";
import Ejimo144 from "./EjimosEmoji/Ejimo144";
import Ejimo145 from "./EjimosEmoji/Ejimo145";
import Ejimo146 from "./EjimosEmoji/Ejimo146";
import Ejimo147 from "./EjimosEmoji/Ejimo147";
import Ejimo148 from "./EjimosEmoji/Ejimo148";
import Ejimo149 from "./EjimosEmoji/Ejimo149";
import Ejimo150 from "./EjimosEmoji/Ejimo150";
import Ejimo151 from "./EjimosEmoji/Ejimo151";
import Ejimo152 from "./EjimosEmoji/Ejimo152";
import Ejimo153 from "./EjimosEmoji/Ejimo153";
import Ejimo154 from "./EjimosEmoji/Ejimo154";
import Ejimo155 from "./EjimosEmoji/Ejimo155";
import Ejimo156 from "./EjimosEmoji/Ejimo156";
import Ejimo157 from "./EjimosEmoji/Ejimo157";
import Ejimo158 from "./EjimosEmoji/Ejimo158";
import Ejimo159 from "./EjimosEmoji/Ejimo159";
import Ejimo160 from "./EjimosEmoji/Ejimo160";
import Ejimo161 from "./EjimosEmoji/Ejimo161";
import Ejimo162 from "./EjimosEmoji/Ejimo162";
import Ejimo163 from "./EjimosEmoji/Ejimo163";
import Ejimo164 from "./EjimosEmoji/Ejimo164";
import Ejimo165 from "./EjimosEmoji/Ejimo165";
import Ejimo166 from "./EjimosEmoji/Ejimo166";
import Ejimo167 from "./EjimosEmoji/Ejimo167";
import Ejimo168 from "./EjimosEmoji/Ejimo168";
import Ejimo169 from "./EjimosEmoji/Ejimo169";
import Ejimo170 from "./EjimosEmoji/Ejimo170";
import Ejimo171 from "./EjimosEmoji/Ejimo171";
import Ejimo172 from "./EjimosEmoji/Ejimo172";
import Ejimo173 from "./EjimosEmoji/Ejimo173";
import Ejimo174 from "./EjimosEmoji/Ejimo174";
import Ejimo175 from "./EjimosEmoji/Ejimo175";
import Ejimo176 from "./EjimosEmoji/Ejimo176";
import Ejimo177 from "./EjimosEmoji/Ejimo177";
import Ejimo178 from "./EjimosEmoji/Ejimo178";
import { formatCountRepost, type formatCount } from "@/lib/utils";







type PostStatsProps = {
  post?: Post;
  userId: string;
};

const PostStatsRate = ({ post, userId }: PostStatsProps) => {
  const [likesCount, setLikesCount] = useState(0);
  const [postLikes, setPostLikes] = useState<any[]>([]);
  const [emojiMap, setEmojiMap] = useState<Record<string, number>>({});
  

  
  const { mutate: likePost } = useLikePost();

  const { data: currentUser } = useGetCurrentUser();

const EMOJIS = [
  { value: "emoji2", component: <Ejimo1 /> },
  { value: "emoji3", component: <Ejimo2 /> },
  { value: "emoji4", component: <Ejimo3 /> },
  { value: "emoji5", component: <Ejimo4 /> },
  { value: "emoji6", component: <Ejimo5 /> },
  { value: "emoji7", component: <Ejimo6 /> },
  { value: "emoji8", component: <Ejimo7 /> },
  { value: "emoji9", component: <Ejimo8 /> },
  { value: "emoji10", component: <Ejimo9 /> },
  { value: "emoji11", component: <Ejimo10 /> },
  { value: "emoji12", component: <Ejimo11 /> },
  { value: "emoji13", component: <Ejimo12 /> },
  { value: "emoji14", component: <Ejimo13 /> },
  { value: "emoji15", component: <Ejimo14 /> },
  { value: "emoji16", component: <Ejimo15 /> },
  { value: "emoji17", component: <Ejimo16 /> },
  { value: "emoji18", component: <Ejimo17 /> },
  { value: "emoji19", component: <Ejimo18 /> },
  { value: "emoji20", component: <Ejimo19 /> },
  { value: "emoji21", component: <Ejimo20 /> },
  { value: "emoji22", component: <Ejimo21 /> },
  { value: "emoji23", component: <Ejimo22 /> },
  { value: "emoji24", component: <Ejimo23 /> },
  { value: "emoji25", component: <Ejimo24 /> },
  { value: "emoji26", component: <Ejimo25 /> },
  { value: "emoji27", component: <Ejimo26 /> },
  { value: "emoji28", component: <Ejimo27 /> },
  { value: "emoji29", component: <Ejimo28 /> },
  { value: "emoji30", component: <Ejimo29 /> },
  { value: "emoji31", component: <Ejimo30 /> },
  { value: "emoji32", component: <Ejimo31 /> },
  { value: "emoji33", component: <Ejimo32 /> },
  { value: "emoji34", component: <Ejimo33 /> },
  { value: "emoji35", component: <Ejimo34 /> },
  { value: "emoji36", component: <Ejimo35 /> },
  { value: "emoji37", component: <Ejimo36 /> },
  { value: "emoji38", component: <Ejimo37 /> },
  { value: "emoji39", component: <Ejimo38 /> },
  { value: "emoji40", component: <Ejimo39 /> },
  { value: "emoji41", component: <Ejimo40 /> },
  { value: "emoji42", component: <Ejimo41 /> },
  { value: "emoji43", component: <Ejimo42 /> },
  { value: "emoji44", component: <Ejimo43 /> },
  { value: "emoji45", component: <Ejimo44 /> },
  { value: "emoji46", component: <Ejimo45 /> },
  { value: "emoji47", component: <Ejimo46 /> },
  { value: "emoji48", component: <Ejimo47 /> },
  { value: "emoji49", component: <Ejimo48 /> },
  { value: "emoji50", component: <Ejimo49 /> },
  { value: "emoji51", component: <Ejimo50 /> },
  { value: "emoji52", component: <Ejimo51 /> },
  { value: "emoji53", component: <Ejimo52 /> },
  { value: "emoji54", component: <Ejimo53 /> },
  { value: "emoji55", component: <Ejimo54 /> },
  { value: "emoji56", component: <Ejimo55 /> },
  { value: "emoji57", component: <Ejimo56 /> },
  { value: "emoji58", component: <Ejimo57 /> },
  { value: "emoji59", component: <Ejimo58 /> },
  { value: "emoji60", component: <Ejimo59 /> },
  { value: "emoji61", component: <Ejimo60 /> },
  { value: "emoji62", component: <Ejimo61 /> },
  { value: "emoji63", component: <Ejimo62 /> },
  { value: "emoji64", component: <Ejimo63 /> },
  { value: "emoji65", component: <Ejimo64 /> },
  { value: "emoji66", component: <Ejimo65 /> },
  { value: "emoji67", component: <Ejimo66 /> },
  { value: "emoji68", component: <Ejimo67 /> },
  { value: "emoji69", component: <Ejimo68 /> },
  { value: "emoji70", component: <Ejimo69 /> },
  { value: "emoji71", component: <Ejimo70 /> },
  { value: "emoji72", component: <Ejimo71 /> },
  { value: "emoji73", component: <Ejimo72 /> },
  { value: "emoji74", component: <Ejimo73 /> },
  { value: "emoji75", component: <Ejimo74 /> },
  { value: "emoji76", component: <Ejimo75 /> },
  { value: "emoji77", component: <Ejimo76 /> },
  { value: "emoji78", component: <Ejimo77 /> },
  { value: "emoji79", component: <Ejimo78 /> },
  { value: "emoji80", component: <Ejimo79 /> },
  { value: "emoji81", component: <Ejimo80 /> },
  { value: "emoji82", component: <Ejimo81 /> },
  { value: "emoji83", component: <Ejimo82 /> },
  { value: "emoji84", component: <Ejimo83 /> },
  { value: "emoji85", component: <Ejimo84 /> },
  { value: "emoji86", component: <Ejimo85 /> },
  { value: "emoji87", component: <Ejimo86 /> },
  { value: "emoji88", component: <Ejimo87 /> },
  { value: "emoji89", component: <Ejimo88 /> },
  { value: "emoji90", component: <Ejimo89 /> },
  { value: "emoji91", component: <Ejimo90 /> },
  { value: "emoji92", component: <Ejimo91 /> },
  { value: "emoji93", component: <Ejimo92 /> },
  { value: "emoji94", component: <Ejimo93 /> },
  { value: "emoji95", component: <Ejimo94 /> },
  { value: "emoji96", component: <Ejimo95 /> },
  { value: "emoji97", component: <Ejimo96 /> },
  { value: "emoji98", component: <Ejimo97 /> },
  { value: "emoji99", component: <Ejimo98 /> },
  { value: "emoji100", component: <Ejimo99 /> },
  { value: "emoji101", component: <Ejimo100 /> },
  { value: "emoji102", component: <Ejimo101 /> },
  { value: "emoji103", component: <Ejimo102 /> },
  { value: "emoji104", component: <Ejimo103 /> },
  { value: "emoji105", component: <Ejimo104 /> },
  { value: "emoji106", component: <Ejimo105 /> },
  { value: "emoji107", component: <Ejimo106 /> },
  { value: "emoji108", component: <Ejimo107 /> },
  { value: "emoji109", component: <Ejimo108 /> },
  { value: "emoji110", component: <Ejimo109 /> },
  { value: "emoji111", component: <Ejimo110 /> },
  { value: "emoji112", component: <Ejimo111 /> },
  { value: "emoji113", component: <Ejimo112 /> },
  { value: "emoji114", component: <Ejimo113 /> },
  { value: "emoji115", component: <Ejimo114 /> },
  { value: "emoji116", component: <Ejimo115 /> },
  { value: "emoji117", component: <Ejimo116 /> },
  { value: "emoji118", component: <Ejimo117 /> },
  { value: "emoji119", component: <Ejimo118 /> },
  { value: "emoji120", component: <Ejimo119 /> },
  { value: "emoji121", component: <Ejimo120 /> },
  { value: "emoji122", component: <Ejimo121 /> },
  { value: "emoji123", component: <Ejimo122 /> },
  { value: "emoji124", component: <Ejimo123 /> },
  { value: "emoji125", component: <Ejimo124 /> },
  { value: "emoji126", component: <Ejimo125 /> },
  { value: "emoji127", component: <Ejimo126 /> },
  { value: "emoji128", component: <Ejimo127 /> },
  { value: "emoji129", component: <Ejimo128 /> },
  { value: "emoji130", component: <Ejimo129 /> },
  { value: "emoji131", component: <Ejimo130 /> },
  { value: "emoji132", component: <Ejimo131 /> },
  { value: "emoji133", component: <Ejimo132 /> },
  { value: "emoji134", component: <Ejimo133 /> },
  { value: "emoji135", component: <Ejimo134 /> },
  { value: "emoji136", component: <Ejimo135 /> },
  { value: "emoji137", component: <Ejimo136 /> },
  { value: "emoji138", component: <Ejimo137 /> },
  { value: "emoji139", component: <Ejimo138 /> },
  { value: "emoji140", component: <Ejimo139 /> },
  { value: "emoji141", component: <Ejimo140 /> },
  { value: "emoji142", component: <Ejimo141 /> },
  { value: "emoji143", component: <Ejimo142 /> },
  { value: "emoji144", component: <Ejimo143 /> },
  { value: "emoji145", component: <Ejimo144 /> },
  { value: "emoji146", component: <Ejimo145 /> },
  { value: "emoji147", component: <Ejimo146 /> },
  { value: "emoji148", component: <Ejimo147 /> },
  { value: "emoji149", component: <Ejimo148 /> },
  { value: "emoji150", component: <Ejimo149 /> },
  { value: "emoji151", component: <Ejimo150 /> },
  { value: "emoji152", component: <Ejimo151 /> },
  { value: "emoji153", component: <Ejimo152 /> },
  { value: "emoji154", component: <Ejimo153 /> },
  { value: "emoji155", component: <Ejimo154 /> },
  { value: "emoji156", component: <Ejimo155 /> },
  { value: "emoji157", component: <Ejimo156 /> },
  { value: "emoji158", component: <Ejimo157 /> },
  { value: "emoji159", component: <Ejimo158 /> },
  { value: "emoji160", component: <Ejimo159 /> },
  { value: "emoji161", component: <Ejimo160 /> },
  { value: "emoji162", component: <Ejimo161 /> },
  { value: "emoji163", component: <Ejimo162 /> },
  { value: "emoji164", component: <Ejimo163 /> },
  { value: "emoji165", component: <Ejimo164 /> },
  { value: "emoji166", component: <Ejimo165 /> },
  { value: "emoji167", component: <Ejimo166 /> },
  { value: "emoji168", component: <Ejimo167 /> },
  { value: "emoji169", component: <Ejimo168 /> },
  { value: "emoji170", component: <Ejimo169 /> },
  { value: "emoji171", component: <Ejimo170 /> },
  { value: "emoji172", component: <Ejimo171 /> },
  { value: "emoji173", component: <Ejimo172 /> },
  { value: "emoji174", component: <Ejimo173 /> },
  { value: "emoji175", component: <Ejimo174 /> },
  { value: "emoji176", component: <Ejimo175 /> },
  { value: "emoji177", component: <Ejimo176 /> },
  { value: "emoji178", component: <Ejimo177 /> },
  { value: "emoji179", component: <Ejimo178 /> },

];

   /* ---------------- FETCH ---------------- */
  useEffect(() => {
    const fetchLikes = async () => {
      const res = await getLikes(post?.$id || "");
      const docs = res.documents;

      setPostLikes(docs);
      setLikesCount(docs.length);

      const map: Record<string, number> = {};

      docs.forEach((like) => {
        if (like.emoji) {
          map[like.emoji] = (map[like.emoji] || 0) + 1;
        }
      });

      setEmojiMap(map);
    };

    if (post?.$id) fetchLikes();
  }, [post?.$id]);

  /* ---------------- CLICK HANDLER ---------------- */
  const handleReact = (value: string) => {
  if (!currentUser || !post?.$id) return;

  const userId = currentUser.$id;

  const existing = postLikes.find(
    (l) => l.user === userId
  );

  let updatedLikes = [...postLikes];
  let updatedMap = { ...emojiMap };
  let updatedCount = likesCount;

  // CASE 1: remove same emoji
  if (existing?.emoji === value) {
    updatedLikes = updatedLikes.filter(
      (l) => l.user !== userId
    );

    updatedMap[value] = Math.max(
      0,
      (updatedMap[value] || 1) - 1
    );

    updatedCount = Math.max(0, updatedCount - 1);
  }

  // CASE 2: switch emoji
  else if (existing) {
    const prev = existing.emoji;

    updatedLikes = updatedLikes.map((l) =>
      l.user === userId ? { ...l, emoji: value } : l
    );

    updatedMap[prev] = Math.max(
      0,
      (updatedMap[prev] || 1) - 1
    );

    updatedMap[value] = (updatedMap[value] || 0) + 1;
  }

  // CASE 3: new reaction
  else {
    updatedLikes.push({
      user: userId,
      emoji: value,
    });

    updatedMap[value] = (updatedMap[value] || 0) + 1;
    updatedCount += 1;
  }

  setPostLikes(updatedLikes);
  setEmojiMap(updatedMap);
  setLikesCount(updatedCount);

  likePost({
    postId: post.$id,
    userId,
    emoji: value,
  });
};
  /* ---------------- UI ---------------- */
  return (
    <div className="w-full space-y-2">
      <span className="ipm">Total Impressions: {formatCountRepost(likesCount)}</span>
      {likesCount > 0 && (
        <div className="bg-card border rounded-xl p-3 space-y-2">
          {[...EMOJIS]
            .sort(
              (a, b) =>
                (emojiMap[b.value] || 0) -
                (emojiMap[a.value] || 0)
            )
            .map((item) => (
              <EmojiBar
                key={item.value}
                emoji={item.component}
                value={item.value}
                count={emojiMap[item.value] || 0}
                total={likesCount}
                onClick={handleReact}
              />
            ))}
        </div>
      )}
      
      {/* <div className="deejay">
       <PostStats post={post}  />
      </div>
      */}
    </div>
  );
};

export default PostStatsRate