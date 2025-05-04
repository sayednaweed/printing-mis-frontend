import { useContext, useEffect, useState } from "react";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import PermissionSub from "@/components/custom-ui/general/PermissionSub";
import { IUserPermission, UserAction } from "@/lib/types";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import ErrorText from "@/components/custom-ui/text/ErrorText";
export default function AddUserPermission() {
  const { t } = useTranslation();
  const { userData, setUserData } = useContext(StepperContext);
  const [failed, setFailed] = useState(false);
  const initialize = async () => {
    try {
      const response = await axiosClient.get(
        `role-permissions/${userData?.role?.id}`
      );

      const rolePermissions = response.data as IUserPermission[];
      if (response.status == 200) {
        setUserData({ ...userData, permissions: rolePermissions });
        if (failed) setFailed(false);
      }
    } catch (error: any) {
      console.log(error);
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      setFailed(true);
    }
  };
  useEffect(() => {
    if (!userData.permissions) initialize();
  }, []);

  const mainActions: {
    [key in UserAction]: (value: boolean, permission: string) => void;
  } = {
    add: (value: boolean, permission: string) => {
      const updatedUserData = userData.permissions.map(
        (perm: IUserPermission) =>
          perm.permission === permission ? { ...perm, add: value } : perm
      );
      setUserData({ ...userData, permissions: updatedUserData });
    },
    delete: (value: boolean, permission: string) => {
      const updatedUserData = userData.permissions.map(
        (perm: IUserPermission) =>
          perm.permission === permission ? { ...perm, delete: value } : perm
      );
      setUserData({ ...userData, permissions: updatedUserData });
    },
    edit: (value: boolean, permission: string) => {
      const updatedUserData = userData.permissions.map(
        (perm: IUserPermission) =>
          perm.permission === permission ? { ...perm, edit: value } : perm
      );
      setUserData({ ...userData, permissions: updatedUserData });
    },
    view: (value: boolean, permission: string) => {
      const updatedUserData = userData.permissions.map(
        (perm: IUserPermission) =>
          perm.permission === permission ? { ...perm, view: value } : perm
      );
      setUserData({ ...userData, permissions: updatedUserData });
    },
    singleRow: (value: boolean, permission: string) => {
      const updatedUserData = userData.permissions.map(
        (perm: IUserPermission) =>
          perm.permission === permission
            ? {
                ...perm,
                add: value,
                edit: value,
                delete: value,
                view: value,
                singleRow: value,
              }
            : perm
      );
      setUserData({ ...userData, permissions: updatedUserData });
    },
  };
  const subActions: {
    [key in UserAction]: (
      value: boolean,
      permission: string,
      subId: number
    ) => void;
  } = {
    add: (value: boolean, permission: string, subId: number) => {
      const updatedUserData = userData.permissions.map(
        (perm: IUserPermission) => {
          if (perm.permission === permission) {
            // Update the sub array with the updated SubPermission
            const updatedSub = perm.sub.map((sub) =>
              sub.id === subId ? { ...sub, add: value } : sub
            );
            return { ...perm, sub: updatedSub }; // Return the updated permission object
          }
          return perm; // No change for other permissions
        }
      );
      setUserData({ ...userData, permissions: updatedUserData });
    },
    delete: (value: boolean, permission: string, subId: number) => {
      const updatedUserData = userData.permissions.map(
        (perm: IUserPermission) => {
          if (perm.permission === permission) {
            // Update the sub array with the updated SubPermission
            const updatedSub = perm.sub.map((sub) =>
              sub.id === subId ? { ...sub, delete: value } : sub
            );
            return { ...perm, sub: updatedSub }; // Return the updated permission object
          }
          return perm; // No change for other permissions
        }
      );
      setUserData({ ...userData, permissions: updatedUserData });
    },
    edit: (value: boolean, permission: string, subId: number) => {
      const updatedUserData = userData.permissions.map(
        (perm: IUserPermission) => {
          if (perm.permission === permission) {
            // Update the sub array with the updated SubPermission
            const updatedSub = perm.sub.map((sub) =>
              sub.id === subId ? { ...sub, edit: value } : sub
            );
            return { ...perm, sub: updatedSub }; // Return the updated permission object
          }
          return perm; // No change for other permissions
        }
      );
      setUserData({ ...userData, permissions: updatedUserData });
    },
    view: (value: boolean, permission: string, subId: number) => {
      const updatedUserData = userData.permissions.map(
        (perm: IUserPermission) => {
          if (perm.permission === permission) {
            // Update the sub array with the updated SubPermission
            const updatedSub = perm.sub.map((sub) =>
              sub.id === subId ? { ...sub, view: value } : sub
            );
            return { ...perm, sub: updatedSub }; // Return the updated permission object
          }
          return perm; // No change for other permissions
        }
      );
      setUserData({ ...userData, permissions: updatedUserData });
    },
    singleRow: (value: boolean, permission: string, subId: number) => {
      const updatedUserData = userData.permissions.map(
        (perm: IUserPermission) => {
          if (perm.permission === permission) {
            // Update the sub array with the updated SubPermission
            const updatedSub = perm.sub.map((sub) =>
              sub.id === subId
                ? {
                    ...sub,
                    add: value,
                    edit: value,
                    delete: value,
                    view: value,
                    singleRow: value,
                  }
                : sub
            );
            return { ...perm, sub: updatedSub }; // Return the updated permission object
          }
          return perm; // No change for other permissions
        }
      );
      setUserData({ ...userData, permissions: updatedUserData });
    },
  };
  return (
    <>
      {failed ? (
        <ErrorText text={t("error")} />
      ) : userData.permissions ? (
        userData.permissions.map((item: IUserPermission, index: number) => (
          <PermissionSub
            subActions={subActions}
            mainActions={mainActions}
            permission={item}
            key={index}
          />
        ))
      ) : (
        <NastranSpinner />
      )}
    </>
  );
}
