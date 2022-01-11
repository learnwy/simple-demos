import { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";
import { memo, useMemo, useState } from "react";

import type { Profile } from "../api/random-profile";

interface RandomProfileProps {
  data: Profile;
}

//region avatar
const ProfileContainer = styled.div`
  margin: 24px auto 0;
  padding: 20px;
  width: 730px;
  background-color: #f7f8f9;
  border-radius: 4px;
`;

const ProfileAvatarContainer = styled.div`
  width: 162px;
  height: 162px;
  margin: 0 auto;
  padding: 5px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 50%;
`;

const ProfileAvatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  box-sizing: content-box;
  overflow: hidden;
`;
//endregion

//region information
const InformationContainer = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  text-align: center;
`;
const InformationLabel = styled.div`
  color: #999;
  font-size: 18px;
`;
const InformationDetail = styled.div`
  color: #2c2e31;
  font-size: 38px;
  margin: 5px;
`;
//endregion

const InformationList = styled.ol`
  list-style: none;
  display: flex;
  justify-content: center;
`;

interface InformationItemProps {
  color: string;
}

const InformationItem = memo(styled.li`
  color: ${({ color }: InformationItemProps) => color};
  cursor: pointer;

  &:not(:first-child) {
    margin-left: 4px;
  }
`);

const RandomProfile: NextPage<RandomProfileProps> = (props) => {
  const [randomProfile, setRandomProfile] = useState(props.data.results[0]);
  const [randomProfileInfo, setRandomProfileInfo] = useState(props.data.info);
  const [loading, setLoading] = useState(false);
  const [currentInformation, setCurrentInformation] = useState<{
    title: string;
    value: string;
  }>(() => {
    return {
      title: "address",
      value: `${randomProfile.location.postcode} ${
        typeof randomProfile.location.street === "string"
          ? randomProfile.location.street
          : randomProfile.location.street.name
      } ${randomProfile.location.city}`,
    };
  });
  const changeRandomProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/random-profile", {
        method: "get",
      });
      const data: Profile = await response.json();
      if (data.results) {
        setRandomProfile(data.results[0]);
        setRandomProfileInfo(data.info);
      }
    } catch (e) {
      alert("fetch data error: " + e.message);
    }
    setLoading(false);
  };
  const informationList = useMemo(
    () =>
      randomProfile
        ? [
            {
              title: "name",
              value: randomProfile.name.first + " " + randomProfile.name.last,
            },
            {
              title: "email",
              value: randomProfile.email,
            },
            {
              title: "birthday",
              value: new Date(
                randomProfile.registered.date
              ).toLocaleDateString(),
            },
            {
              title: "address",
              value: `${randomProfile.location.postcode} ${
                typeof randomProfile.location.street === "string"
                  ? randomProfile.location.street
                  : randomProfile.location.street.name
              } ${randomProfile.location.city}`,
            },
            {
              title: "phone number",
              value: randomProfile.phone,
            },
            {
              title: "username",
              value: randomProfile.login.username,
            },
          ]
        : [],
    [randomProfile]
  );
  const memoInformationList = useMemo(() => {
    return (
      <InformationList>
        {informationList.map((information, index) => {
          return (
            <InformationItem
              key={information.title + " " + information.value}
              onClick={() => setCurrentInformation(information)}
              color={
                "#" +
                Math.floor(
                  (Math.random() * 0xffffff) / informationList.length +
                    (0xffffff * index) / informationList.length
                )
                  .toString(16)
                  .padStart(6, "0")
              }
            >
              {information.title}
            </InformationItem>
          );
        })}
      </InformationList>
    );
  }, [informationList]);
  if (loading) {
    return <div>...</div>;
  }
  return (
    <ProfileContainer>
      <Head>
        <meta name="og:title" content="Fans SSR Next Demo" />
        <meta name="op:logo" content="/vercel.svg" />
        <meta name="op:sharInfo" content={JSON.stringify(randomProfileInfo)} />
      </Head>
      <ProfileAvatarContainer onClick={changeRandomProfile}>
        <ProfileAvatar
          src={randomProfile.picture.medium}
          width={150}
          height={150}
          alt="avatar"
        />
      </ProfileAvatarContainer>
      <InformationContainer>
        <InformationLabel>My {currentInformation.title} is</InformationLabel>
        <InformationDetail>{currentInformation.value}</InformationDetail>
      </InformationContainer>
      {memoInformationList}
    </ProfileContainer>
  );
};

RandomProfile.getInitialProps = async (ctx) => {
  const response = await fetch("http://localhost:3000/api/random-profile", {
    method: "get",
  });
  const data = await response.json();
  return {
    data,
  };
};

export default RandomProfile;
