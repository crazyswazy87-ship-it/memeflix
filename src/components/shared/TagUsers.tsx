import { useState } from "react";
import { useGetUsers, useSearchUsers } from "@/lib/react-query/queriesAndMutations";
import MemelordSearchInput from "@/components/shared/MemelordsSearchInput";

type TagUsersProps = {
  selected: string[]; // user IDs
  setSelected: (users: string[]) => void;
};

const TagUsers = ({ selected, setSelected }: TagUsersProps) => {
  const [searchValue, setSearchValue] = useState("");

  const { data: searchedUsers } = useSearchUsers(searchValue);
  const { data: creators } = useGetUsers();

  const usersToShow = searchValue.trim() ? searchedUsers : creators;

  const toggleUser = (userId: string) => {
    if (selected.includes(userId)) {
      setSelected(selected.filter((id) => id !== userId));
    } else {
      setSelected([...selected, userId]);
    }
  };

  if (!usersToShow?.documents) return null;

  return (
    <div className="user-tags">
      {/* SEARCH */}
      <MemelordSearchInput
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}

      />

      {/* USERS */}
      <ul className="user-gats">
        {usersToShow.documents.map((user: any) => {
          const isSelected = selected.includes(user.$id);

          return (
            <li
              key={user.$id}
              className={`zee cursor-pointer ${
                isSelected ? "border-2 border-red-500" : ""
              }`}
              onClick={() => toggleUser(user.$id)}
             >
              <div className="relative">
                <img
                  src={user.imageUrl || "/assetss/images/profile-pic.png"}
                  className="tapro"
                />

                {/* ✅ check mark */}
                {isSelected && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                    ✓
                  </div>
                )}
              </div>

              <p>@{user.username}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TagUsers;