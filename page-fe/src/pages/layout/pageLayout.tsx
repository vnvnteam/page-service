import SplitPane from "@/pages/layout/splitLayout";
import LayoutPanel from "@/pages/layout/panelLayout";
import LayoutPreview from "@/pages/layout/previewLayout";
import PageLayoutMetaForm from "@/pages/layout/formLayout";
import { usePageLayoutEditor } from "@/hook/pageLayout";

export default function PageLayoutPage() {
  const vm = usePageLayoutEditor();

  return (
    <div
      style={{
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#ffffff",
      }}
    >

      <PageLayoutMetaForm
        items={vm.items}
        loadingList={vm.loadingList}
        saving={vm.saving}
        form={vm.form}
        message={vm.message}
        onSelectLayout={vm.handleSelectLayout}
        onUpdateForm={vm.updateForm}
        onToggleActive={vm.handleToggleActive}
        onCreate={vm.handleCreate}
        onUpdate={vm.handleUpdate}
        onDelete={vm.handleDelete}
        onReset={vm.resetFormForCreate}
      />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <SplitPane
          left={
            <LayoutPanel
              layoutJson={vm.layoutJson}
              selectedBlock={vm.selectedBlock}
              selectedBlockData={vm.selectedBlockData}
              onSelectBlock={vm.setSelectedBlock}
              onAddBlock={vm.addBlock}
              onRemoveBlock={vm.removeBlock}
              onToggleBlock={vm.toggleBlock}
              onMoveBlock={vm.moveBlock}
              onUpdateOptions={vm.updateBlockOptions}
            />
          }
          right={<LayoutPreview layoutJson={vm.layoutJson} />}
        />
      </div>
    </div>
  );
}