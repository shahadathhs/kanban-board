import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: any }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json(
      { message: "Project ID is required" },
      { status: 400 }
    );
  }
  await dbConnect();

  const project = await Project.findById(id);
  return NextResponse.json(project);
}

export async function DELETE(request: Request, { params }: { params: any }) {
  await dbConnect();
  const { id } = params;
  if (!id) {
    return NextResponse.json(
      { message: "Project ID is required" },
      { status: 400 }
    );
  }
  const project = await Project.findByIdAndDelete(id);
  return NextResponse.json(project);
}

export async function PATCH(request: Request, { params }: { params: any }) {
  await dbConnect();
  const body = await request.json();
  const { id } = params;
  const project = await Project.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(project);
}
