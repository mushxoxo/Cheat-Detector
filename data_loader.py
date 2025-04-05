import os
import cv2
import numpy as np
from torch.utils.data import Dataset

class CheatDataset(Dataset):
    def __init__(self, root_dir, label_map, transform=None):
        self.root_dir = root_dir
        self.transform = transform
        self.samples = []

        for folder in os.listdir(root_dir):
            path = os.path.join(root_dir, folder)
            if not os.path.isdir(path): continue
            label = label_map.get(folder, 0)  # 1=cheating, 0=not
            frame_path = sorted([os.path.join(path, f) for f in os.listdir(path) if f.endswith('.jpg')])
            if frame_path:
                img = cv2.imread(frame_path[len(frame_path)//2])  # use middle frame
                img = cv2.resize(img, (224, 224))
                self.samples.append((img, label))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img, label = self.samples[idx]
        if self.transform:
            img = self.transform(img)
        return img, label
