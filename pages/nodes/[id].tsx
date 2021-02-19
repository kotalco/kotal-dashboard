import PageDetailsHeader from '@components/molecules/PageDetailsHeader/PageDetailsHeader';
import StatsComponent from '@components/molecules/Stats/Stats';
import TabsHeader from '@components/organisms/TabsHeader/TabsHeader';
import Layout from '@components/templates/Layout/Layout';

const NodeDetails: React.FC = () => {
  return (
    <Layout>
      <div className="py-6">
        <PageDetailsHeader
          nodeName="my-etheruen-node"
          date="January 11, 2021"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Stats */}
          <div>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <StatsComponent title="Last Block Number" content="11,971,897" />
              <StatsComponent title="Transactions Today" content="1,024,569" />
              <StatsComponent title="Connected Peers" content="21" />
            </dl>
          </div>

          {/* Tabs */}
          <div className="bg-white overflow-hidden shadow rounded-lg divided-y divided-gray-200 mt-4">
            <div className="px-4 py-5 sm:px-6">
              <TabsHeader />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NodeDetails;
