import getAllModels from "@/app/actions/getAllModels";
import { Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";

interface Model {
  _id: string;
  name: string;
  __v: number;
}

const ModalSelection = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      setIsLoading(true);
      const models = await getAllModels();
      setModels(models.data);
    };
    fetchModels();
    setIsLoading(false);
  }, []);

  const onModelSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedModel = models.find(
      (model) => model._id === event.target.value
    );
    localStorage.setItem("aiModel", selectedModel?.name || "");
  };

  return (
    <>
      <label className="block text-sm font-medium mb-1">AI Model</label>
      <Select
        fullWidth
        placeholder="Select an AI model"
        onChange={onModelSelect}
        isLoading={isLoading}
      >
        {models?.map((model) => (
          <SelectItem key={model._id}>{model.name}</SelectItem>
        ))}
      </Select>
    </>
  );
};

export default ModalSelection;
