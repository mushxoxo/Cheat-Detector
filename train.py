import torch
from torch.utils.data import DataLoader
from torchvision import transforms
from data_loader import CheatDataset
from model import get_model

label_map = {
    "Scenario 1": 1,
    "Scenario 2": 0,
    # Add all scenarios and labels here
}

transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5]*3, std=[0.5]*3),
])

dataset = CheatDataset("Cheat Database", label_map, transform)
loader = DataLoader(dataset, batch_size=4, shuffle=True)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = get_model().to(device)
criterion = torch.nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)

for epoch in range(10):
    for imgs, labels in loader:
        imgs, labels = imgs.to(device), labels.to(device)
        outputs = model(imgs)
        loss = criterion(outputs, labels)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
    print(f"Epoch {epoch+1}: Loss={loss.item():.4f}")
