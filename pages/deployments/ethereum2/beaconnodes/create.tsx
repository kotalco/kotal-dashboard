import Layout from '@components/templates/Layout/Layout'
import FormLayout from '@components/templates/FormLayout/FormLayout'
import CreateNodeForm from '@components/organisms/CreateNodeForm/CreateNodeForm'

const CreateNode: React.FC = () => {
  return (
    <Layout>
      <FormLayout title="Create New Beacon Node">
        <CreateNodeForm />
      </FormLayout>
    </Layout>
  )
}

export default CreateNode
