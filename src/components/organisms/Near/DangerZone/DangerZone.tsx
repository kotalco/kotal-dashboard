import { useRouter } from 'next/router';

import Button from '@components/atoms/Button/Button';
import DeleteDialog from '@components/organisms/DeleteDialog/DeleteDialog';
import { NotificationInfo } from '@interfaces/NotificationInfo';
import { Deployments } from '@enums/Deployments';
import { useModal } from '@hooks/useModal';
import { deleteNearNode } from '@utils/requests/near';

interface Props {
  nodeName: string;
}

const DangerZone: React.FC<React.PropsWithChildren<Props>> = ({ nodeName }) => {
  const { isOpen, open, close } = useModal();
  const router = useRouter();

  const deleteDepolyment = async () => {
    await deleteNearNode(nodeName);

    const notification: NotificationInfo = {
      title: 'NEAR Node has been deleted',
      message: 'Node has been deleted successfully.',
      deploymentName: nodeName,
    };
    localStorage.setItem(Deployments.near, JSON.stringify(notification));
    router.push('/deployments/near/nodes');
  };

  return (
    <>
      <div>
        <div className="px-4 py-5 sm:p-6">
          <p className="text-gray-700">
            By deleting this node, all connected apps will lose access to the
            Blockchain Network.
          </p>
          <p className="text-gray-700">
            Node attached volume that persists Blockchain data will not be
            removed, you need to delete it yourself.
          </p>
          <p className="text-gray-700">
            Are you sure you want to delete this node?
          </p>
        </div>
        <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
          <Button className="btn btn-alert" onClick={open}>
            Delete Node
          </Button>
        </div>
      </div>

      <DeleteDialog
        isOpen={isOpen}
        close={close}
        name={nodeName}
        protocol="NEAR"
        resource="Node"
        deleteDepolyment={deleteDepolyment}
      />
    </>
  );
};

export default DangerZone;
